import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from 'modules/config/config.module';
import { User } from 'modules/user/user.entity';
import { RideController } from './ride.controller';
import { Ride } from './ride.entity';
import { RideRepository } from './ride.repository';
import { RideService } from './ride.service';
import { RideUser } from './rideUser.entity';
import { RideUserRepository } from './rideUser.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Ride, RideRepository, User, RideUser, RideUserRepository]), ConfigModule],
  controllers: [RideController],
  providers: [RideService]
})
export class RideModule { }
