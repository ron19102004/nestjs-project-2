import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { LOGIN_METHOD } from '../gateways/auths-signIn.gateway';

export class SignInDto {
  @ApiProperty({ nullable: false })
  @IsString()
  @IsEnum(LOGIN_METHOD)
  public login_method: string;
  @ApiProperty({ nullable: false })
  @IsString()
  public data_login_first: string;
  @ApiProperty({ nullable: false })
  @IsString()
  public password: string;
}
