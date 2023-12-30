import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString } from 'class-validator';

export class CreateStatusDto {
  @ApiProperty({ nullable: false })
  @IsString()
  public name: string;
  @ApiProperty({ nullable: false })
  @IsBoolean()
  public value: boolean;
}
