import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateDepartmentDto {
  @ApiProperty({ nullable: false })
  @IsString()
  public name: string;
  @ApiProperty({ nullable: true })
  @IsString()
  public description: string;
  @ApiProperty({ nullable: false })
  @IsString()
  public duties: string;
  @ApiProperty({ nullable: true })
  @IsString()
  public equipment_system: string;
  @ApiProperty({ nullable: true })
  @IsString()
  public treatment_techniques: string;
  @ApiProperty({ nullable: true })
  @IsString()
  public avatar: string;
  @ApiProperty({ nullable: false })
  @IsNumber()
  public branch_id: number;
}
