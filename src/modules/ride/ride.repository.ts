import { ConfigService } from 'modules/config/config.service';
import { EntityRepository, Repository, SelectQueryBuilder } from 'typeorm';
import { Ride, RideStatus } from './ride.entity';
import { RideUserStatus } from './rideUser.entity';

@EntityRepository(Ride)
export class RideRepository extends Repository<Ride> {
    constructor(private configService: ConfigService) {
        super();
    }

    getRidesWithinDistance(startLocation: [number, number], endLocation: [number, number]) {
        // const distance = this.configService.getRadius;
        const distance = 10000;
        return this.query(
            `SELECT *, ST_AsGeoJSON("startLocation")::json as "startLocation", ST_AsGeoJSON("endLocation")::json as "endLocation",
                ST_AsGeoJSON("route")::json as "route", ST_Distance(route, ST_MakePoint(${startLocation[0]}, ${startLocation[1]})) * 111139 as "distanceFromStart",
                ST_Distance(route, ST_MakePoint(${endLocation[0]}, ${endLocation[1]})) * 111139 as "distanceFromEnd" from ride 
                WHERE ST_DWithin(route, ST_MakePoint(${startLocation[0]}, ${startLocation[1]})::geography, ${distance})
                AND ST_DWithin(route, ST_MakePoint(${endLocation[0]}, ${endLocation[1]})::geography, ${distance})
                AND status = '${RideStatus.SCHEDULED}'
            ;`
        )
    }

    getRidesByIds(rideIds: number[], rideStatus?: RideStatus, status?: RideUserStatus, isDriver?: boolean) {
        const query = this.createQueryBuilder('ride')
            .innerJoinAndSelect('ride.rideUsers', 'rideUser')
            .innerJoinAndSelect('rideUser.user', 'user')
            .where('ride.id in (:...rideIds)', { rideIds })
        if (status) {
            query.where('rideUser.status = :status', { status });
        }
        if (rideStatus) {
            query.andWhere('ride.status = :rideStatus', { rideStatus })
        }
        return query;
    }
}
