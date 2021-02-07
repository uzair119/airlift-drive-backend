import { User } from 'modules/user/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne, BaseEntity } from 'typeorm';
import { Ride } from './ride.entity';



export enum RideUserStatus {
  'REQUESTED' = 'REQUESTED',
  'ACCEPTED' = 'ACCEPTED',
  'DECLINED' = 'DECLINED',
  'ON_BOARD' = 'ON_BOARD',
  'DROPPED_OFF' = 'DROPPED_OFF',
  'CANCELLED' = 'CANCELLED',
}

@Entity({
  name: 'rideUser',
})
export class RideUser extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'user_id', nullable: false })
  userId!: number;

  @Column({ name: 'ride_id', nullable: false })
  rideId!: number;

  @ManyToOne(type => User, user => user.id)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @ManyToOne(type => Ride, ride => ride.id)
  @JoinColumn({ name: 'ride_id' })
  ride!: Ride;

  @Column('geometry', {
    nullable: true,
  })
  public lastLocation!: { type: 'Point'; coordinates: [number, number] };

  @Column('geometry', {
    nullable: true,
  })
  public pickupLocation!: { type: 'Point'; coordinates: [number, number] };

  @Column('geometry', {
    nullable: true,
  })
  public dropoffLocation!: { type: 'Point'; coordinates: [number, number] };

  @Column({ type: 'boolean', default: false })
  isDriver!: boolean;

  @Column({ type: 'timestamptz', nullable: true })
  startTime!: Date;

  @Column({ type: 'timestamptz', nullable: true })
  endTime!: Date;

  @Column({
    type: 'enum',
    enum: RideUserStatus,
    default: RideUserStatus.REQUESTED,
  })
  status!: RideUserStatus;

  @Column({ nullable: true })
  fare!: number
}
