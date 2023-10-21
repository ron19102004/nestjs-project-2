/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { Sex } from '../interfaces/enum';
import {
  IsEmail,
  IsEnum,
  IsNumber,
  IsNumberString,
  IsString,
} from 'class-validator';
export class CreateUserDto {
  @ApiProperty({ nullable: false })
  @IsString()
  firstName: string;
  @ApiProperty({ nullable: false })
  @IsString()
  lastName: string;
  @ApiProperty({ nullable: false })
  @IsString()
  address: string;
  @ApiProperty({ nullable: false })
  password: string;
  @ApiProperty({ nullable: false })
  @IsEnum(Sex)
  @IsString()
  sex: string;
  @ApiProperty({ nullable: false })
  @IsNumber()
  age: number;
  @ApiProperty({ pattern: '/(0|84)[0-9]{9}/' })
  @IsNumberString()
  public phoneNumber: string;
  @ApiProperty({ pattern: '/[a-zA-Z0-9_-]+@(vku.udn.vn|gmail.com)/' })
  @IsEmail()
  public email: string;
  
}
