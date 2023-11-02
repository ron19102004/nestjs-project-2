/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AskGptDto {
  @ApiProperty({ nullable: false })
  @IsString()
  public question: string;
}
