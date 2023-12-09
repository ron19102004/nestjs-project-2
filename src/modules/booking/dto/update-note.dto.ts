import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class UpdateNoteDto {
  @ApiProperty()
  @IsNumber()
  booking_id: number;
  @ApiProperty()
  @IsString()
  note: string;
}
