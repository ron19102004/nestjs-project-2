import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateProcessBookingDto {
  @ApiProperty({ nullable: false })
  @IsNumber()
  public bookingId: number;
  @ApiProperty({ nullable: false })
  @IsString()
  public time: string;
  @ApiProperty({ nullable: true })
  @IsString()
  public notes: string;
}
