/* eslint-disable prettier/prettier */
import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import {  ApiTags } from '@nestjs/swagger';
import { IUserDto, UserDto } from './dto/user-dto';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post('/')
  @HttpCode(HttpStatus.OK)
  public async createUser(@Body() createUserDto: CreateUserDto) {
    const userDto: IUserDto<CreateUserDto> = new UserDto(createUserDto);
    return await this.userService.createUser(userDto);
  }
}
