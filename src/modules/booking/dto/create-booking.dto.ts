import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateBookingDto {
  @ApiProperty({ nullable: false })
  @IsNumber()
  public user_service_id: number;
  @ApiProperty({ nullable: false })
  @IsNumber()
  public admin_id: number;
  @ApiProperty({ nullable: false })
  @IsNumber()
  public user_id: number;
  @ApiProperty({ nullable: true })
  @IsString()
  public note: string;
  @ApiProperty({ nullable: false })
  @IsString()
  public appointment_date: string;
}
