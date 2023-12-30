import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export class ActionSeenDto {
  @ApiProperty({ nullable: false })
  @IsArray()
  public id_mess: number[];
}
