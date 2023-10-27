import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateUserServiceDto {
  @ApiProperty({ nullable: false })
  @IsNumber({ allowNaN: false })
  public user_id: number;
  @ApiProperty({ nullable: false })
  @IsNumber({ allowNaN: false })
  public service_id: number;
}
