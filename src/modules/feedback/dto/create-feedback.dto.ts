import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateFeedbackDto {
  @ApiProperty({ nullable: false })
  @IsString()
  public subject: string;
  @ApiProperty({ nullable: false })
  @IsString()
  public content: string;
}
