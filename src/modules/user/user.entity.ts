import { Exclude } from 'class-transformer';
import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';

import { PasswordTransformer } from './password.transformer';

@Entity({
  name: 'users',
})
export class User extends BaseEntity{
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 255 })
  firstName!: string;

  @Column({ length: 255 })
  lastName!: string;

  @Column({ length: 255 })
  email!: string;

  @Column({ length: 255, nullable: true })
  contact!: string;

  @Column({ length: 15, nullable: true })
  gender!: string;

  @Column({type: 'timestamptz', nullable: true})
  dateOfBirth!: Date;

  @Column({ length: 50, nullable: true })
  carModel!: string;

  @Column({ length: 10, nullable: true })
  registrationNumber!: string;

  @Column({ length: 255, nullable: true })
  cnic!: string;

  @Column({
    name: 'password',
    length: 255,
    select: false,
  })
  @Exclude()
  password!: string;

  @Column({ default: 0 })
  alcs!: number
}

export class UserFillableFields {
  email!: string;
  contact!: string;
  cnic!: string;
  firstName!: string;
  lastName!: string;
  password!: string;
}
