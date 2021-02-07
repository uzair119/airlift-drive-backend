// import { ApiModelProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterPayload {
  // @ApiModelProperty({ required: true })
  @IsEmail()
  email!: string;

  // @ApiModelProperty({ required: true })
  @IsNotEmpty()
  firstName!: string;

  // @ApiModelProperty({ required: true })
  @IsNotEmpty()
  lastName!: string;

  @IsNotEmpty()
  contact!: string;

  @IsNotEmpty()
  gender!: string;

  @IsNotEmpty()
  dateOfBirth!: Date;

  @IsNotEmpty()
  carModel!: string;

  @IsNotEmpty()
  registrationNumber!: string;
  
  @IsNotEmpty()
  cnic!: string;

  // @ApiModelProperty({ required: true })
  @IsNotEmpty()
  @MinLength(5)
  password!: string;
}
