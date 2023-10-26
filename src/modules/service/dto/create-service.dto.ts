import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateServiceDto {
  @ApiProperty({ nullable: false })
  @IsString()
  public name: string;
  @ApiProperty({ nullable: true })
  @IsString()
  public description: string;
  @ApiProperty({ nullable: false })
  @IsNumber()
  public price: number;
  @ApiProperty({ nullable: false })
  @IsNumber()
  public department_id: number;
}
