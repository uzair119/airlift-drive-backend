import { ConfigService } from 'modules/config/config.service';
import { EntityRepository, Repository } from 'typeorm';
import { RideUser } from './rideUser.entity';

@EntityRepository(RideUser)
export class RideUserRepository extends Repository<RideUser> {
    constructor() {
        super();
    }
}
