/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class ShowAllForAdminDto {
  @ApiProperty({ nullable: true, default: 0 })
  @IsNumber()
  public skip: number;
  @ApiProperty({ nullable: true, default: 15 })
  @IsNumber()
  public take: number;
}
