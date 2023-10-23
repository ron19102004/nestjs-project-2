/* eslint-disable prettier/prettier */

import { ApiProperty } from "@nestjs/swagger";
import { IsNumberString, IsString } from "class-validator";

export class CreateMessageDto{
    @ApiProperty({ pattern: '/(0|84)[0-9]{9}/' })
    @IsNumberString()
    public phoneNumber: string;
    @ApiProperty({nullable: false})
    @IsString()
    public message: string;
}