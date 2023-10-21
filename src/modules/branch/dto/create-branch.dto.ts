/* eslint-disable prettier/prettier */
import { ApiProperty } from "@nestjs/swagger"
import { IsDateString, IsEmail, IsNumberString, IsString } from 'class-validator';

export class CreateBranchDto {
    @ApiProperty({ nullable: false })
    @IsString()
    public name: string
    @ApiProperty({ nullable: true })
    @IsString() 
    public description: string
    @ApiProperty({ nullable: true })
    @IsDateString()
    public establish_at: Date
    @ApiProperty({ nullable: true })
    @IsString()
    public src_map: string
    @ApiProperty({ nullable: false })
    @IsString()
    public address: string
    @ApiProperty({ pattern: '/(0|84)[0-9]{9}/' })
    @IsNumberString()
    public hotline: string
    @ApiProperty({ pattern: '/[a-zA-Z0-9_-]+@(vku.udn.vn|gmail.com)/'})
    @IsEmail()
    public email: string
} 
