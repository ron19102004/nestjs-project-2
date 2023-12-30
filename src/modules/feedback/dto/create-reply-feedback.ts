import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateReplyFeedbackDto {
  @ApiProperty({ nullable: false })
  @IsString()
  public content: string;
}
