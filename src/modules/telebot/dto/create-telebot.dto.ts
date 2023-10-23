/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateTeleBotDto {
  @ApiProperty({nullable: false})
  @IsString()
  title: string;
  @ApiProperty({nullable: false})
  @IsString()
  acronym: string;
  @ApiProperty({nullable: false})
  @IsString()
  content: string;
  @ApiProperty({nullable:true})
  @IsString()
  link_pic: string;
}
