import { Exclude } from 'class-transformer';
import { PasswordTransformer } from 'modules/user/password.transformer';
import { User } from 'modules/user/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne, BaseEntity, OneToMany } from 'typeorm';
import { RideUser } from './rideUser.entity';




export enum RideStatus {
    'SCHEDULED' = 'SCHEDULED',
    'ACTIVE' = 'ACTIVE',
    'COMPLETED' = 'COMPLETED',
    'CANCELLED' = 'CANCELLED',
}

@Entity({
    name: 'ride',
})
export class Ride extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'timestamptz', nullable: false })
    startTime!: Date;

    @Column({ type: 'timestamptz', nullable: true })
    endTime!: Date;

    @Column({ name: 'driver_id', nullable: false })
    driverId!: number;

    @Column({ nullable: false })
    maxPassengers!: number;

    @ManyToOne(type => User, user => user.id)
    @JoinColumn({ name: 'driver_id' })
    driver!: User;

    @Column('geometry', {
        nullable: false,
        name: 'route'
    })
    public route!: { type: 'LineString'; coordinates: any[] };

    @Column('geometry', {
        nullable: false,
    })
    public startLocation!: { type: 'Point'; coordinates: [number, number] };

    @Column('geometry', {
        nullable: false,
    })
    public endLocation!: { type: 'Point'; coordinates: [number, number] };

    @OneToMany(
        type => RideUser,
        rideUser => rideUser.ride
    )
    public rideUsers!: RideUser[];

    @Column({
        type: 'enum',
        enum: RideStatus,
        default: RideStatus.SCHEDULED,
    })
    status!: RideStatus;

    @Column({ default: 50 })
    perPassengerFare!: number

    @Column({nullable: true})
    startLocationName?: string;

    @Column({nullable: true})
    endLocationName?: string;

    @Column({nullable: true})
    estimatedDuration?: string;

    @Column({nullable: true})
    distance?: string;
}
