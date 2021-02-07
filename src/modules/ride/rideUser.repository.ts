import { ConfigService } from 'modules/config/config.service';
import { EntityRepository, Repository } from 'typeorm';
import { RideUser, RideUserStatus } from './rideUser.entity';

@EntityRepository(RideUser)
export class RideUserRepository extends Repository<RideUser> {
    constructor() {
        super();
    }

    getRidePassengerCount(rideIds: number[]) {
        return this.createQueryBuilder('rideUser')
            .select('count(*) as count, ride_id')
            .where('rideUser.status = :status', {status: RideUserStatus.ACCEPTED})
            .andWhere('rideUser.ride_id IN (:...rideIds)', {rideIds})
            .groupBy('rideUser.ride_id');
    }
}
