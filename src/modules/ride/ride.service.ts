import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'modules/user/user.entity';
import { FindConditions, getManager, In, Repository } from 'typeorm';
import { createRideDto } from './dtos/createRide.dto';
import { Ride, RideStatus } from './ride.entity';
import { RideRepository } from './ride.repository';
import { RideUser, RideUserStatus } from './rideUser.entity';
import { RideUserRepository } from './rideUser.repository';

@Injectable()
export class RideService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private rideRepository: RideRepository,
        private rideUserRepository: RideUserRepository,
    ) {

    }

    async createRide(input: createRideDto.Input) {

        return await getManager().transaction(async (entityManager) => {

            const ride = new Ride();
            ride.driverId = input.userId;
            ride.startTime = input.startTime;
            ride.maxPassengers = input.maxPassengers;
            ride.route = { type: 'LineString', coordinates: input.route };
            ride.startLocation = { type: 'Point', coordinates: input.route[0] };
            ride.endLocation = { type: 'Point', coordinates: input.route[input.route.length - 1] };
            ride.perPassengerFare = input.perPassengerFare ?? 0;
            ride.startLocationName = input.startLocationName;
            ride.endLocationName = input.endLocationName;
            ride.estimatedDuration = input.estimatedDuration;
            ride.distance = input.distance;

            await entityManager.save(ride);

            const rideUser = new RideUser();
            rideUser.ride = ride;
            rideUser.userId = ride.driverId;
            rideUser.isDriver = true;

            await entityManager.save(rideUser);

            return ride;
        });
    }

    async getAllRides() {
        return this.rideRepository.find();
    }

    async getRidesByUserId(userId: number, status?: RideUserStatus, isDriver?: boolean) {
        return this.rideRepository.getRidesByUserId(userId, status, isDriver);
    }

    async getRideDetails(rideId: number) {
        return await this.rideRepository.findOneOrFail({ where: { id: rideId }, relations: ["driver", "rideUsers", "rideUsers.user"] });
    }

    async requestRide(userId: number, rideId: number, pickupLocation: [number, number], dropoffLocation: [number, number]) {

        return await getManager().transaction(async (entityManager) => {
            const ride = await this.rideRepository.findOneOrFail(rideId);
            const user = await this.userRepository.findOneOrFail(userId);
            if (user.alcs < ride.perPassengerFare) {
                throw new BadRequestException('Not enough ALCs for this ride!');
            }

            const rideUser = new RideUser();
            rideUser.user = user;
            rideUser.ride = ride;
            rideUser.pickupLocation = { type: 'Point', coordinates: pickupLocation };
            rideUser.dropoffLocation = { type: 'Point', coordinates: dropoffLocation };
            // rideUser.status = RideUserStatus.REQUESTED;
            rideUser.status = RideUserStatus.ACCEPTED;
            rideUser.fare = ride.perPassengerFare;
            user.alcs -= ride.perPassengerFare;

            await entityManager.save(user);
            await entityManager.save(rideUser);
            return rideUser;
        });
    }

    async updateRideUserStatus(rideId: number, userId: number, status: RideUserStatus) {
        const rideUser = await this.rideUserRepository.findOneOrFail({ where: { userId: userId, rideId: rideId } });
        rideUser.status = status;
        if (status === RideUserStatus.ON_BOARD) {
            rideUser.startTime = new Date();
        } else if (status === RideUserStatus.DROPPED_OFF) {
            rideUser.endTime = new Date();
        }
        return await this.rideUserRepository.save(rideUser);
    }

    async getRidesWithinDistance(startLocation: [number, number], endLocation: [number, number]) {
        let rides: any[] = await this.rideRepository.getRidesWithinDistance(startLocation, endLocation);
        const rideIds = rides.map(ride => ride.id);
        if (!rideIds.length) {
            return [];
        }
        const driverIds = rides.map(ride => ride.driver_id);
        const drivers = await this.userRepository.findByIds(driverIds);
        const driverMap: any = {};
        for (const driver of drivers) {
            driverMap[driver.id] = driver;
        }

        rides.forEach(ride => {
            ride.totalDistance = ride.distanceFromStart + ride.distanceFromEnd;
            ride.driver = driverMap[ride.driver_id];
        });

        rides = rides.sort((a, b) => a.totalDistance - b.totalDistance);
        return rides;
    }

    async updateRideUserLocation(rideId: number, userId: number, location: [number, number]) {
        const rideUser = await this.rideUserRepository.findOneOrFail({ where: { userId: userId, rideId: rideId }, relations: ["user"] });
        rideUser.lastLocation = { type: 'Point', coordinates: location };
        return await this.rideUserRepository.save(rideUser);
    }

    async updateRideStatus(rideId: number, status: RideStatus) {
        return await getManager().transaction(async (entityManager) => {

            const ride = await this.rideRepository.findOneOrFail(rideId);
            ride.status = status;
            if (status == RideStatus.COMPLETED) {
                const driver = await this.userRepository.findOneOrFail(ride.driverId);
                const rideUsers = await this.rideUserRepository.find({ where: { rideId: rideId } });
                const totalAlcs = rideUsers.map(rideUser => rideUser.fare).reduce((prev, curr) => {
                    return prev + curr;
                }, 0);
                driver.alcs += totalAlcs;
                await entityManager.save(driver);
            } else if(status == RideStatus.CANCELLED) {
                const rideUsers = await this.rideUserRepository.find({ where: { rideId: rideId }, relations: ["user"] });
                for (const rideUser of rideUsers) {
                    const fare = rideUser.fare;
                    rideUser.user.alcs += fare;
                    rideUser.status = RideUserStatus.CANCELLED;
                }
                await entityManager.save(rideUsers);
            }
            await entityManager.save(ride);
            return ride;
        });
    }
}
