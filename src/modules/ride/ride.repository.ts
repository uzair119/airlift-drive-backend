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
        const distance = 2000;
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

    getRidesByUserId(userId: number, status?: RideUserStatus, isDriver?: boolean) {
        const query = this.createQueryBuilder('ride')
            .innerJoinAndSelect('ride.rideUsers', 'rideUsers', 'rideUser.userId = :userId', { userId });
            if (status) {
                query.where('rideUser.status = :status', { status });
            }
            if (isDriver) {
                query.andWhere('rideUser.isDriver = TRUE');
            }
        return query;
    }
}
