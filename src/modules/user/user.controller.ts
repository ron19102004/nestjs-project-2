/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  UseGuards,
  Param,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IUserDto, UserDto } from './dto/user-dto';
import { Roles } from 'src/auths/decorators/role.decorator';
import { Role } from './interfaces/enum';
import { RolesGuard } from 'src/guards/role.guard';
import { AuthsGuard } from 'src/auths/auths.guard';
import { Admin } from './entities/admin.entity';
import { MyselfGuard } from 'src/guards/myself.guard';
import { UpdateUserDto } from './dto/update-user.dto';

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
  @Get('/id=:id')
  @Roles(Role.master, Role.admin)
  @UseGuards(RolesGuard)
  @UseGuards(AuthsGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  async getById(@Param('id') id: number) {
    return this.modifyAccount(await this.userService.findById(id));
  }
  @Get('/email=:email')
  @Roles(Role.master, Role.admin)
  @UseGuards(RolesGuard)
  @UseGuards(AuthsGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  async getByEmail(@Param('email') email: string) {
    return this.modifyAccount(await this.userService.findByEmail(email));
  }
  @Get('/phoneNumber=:phone')
  @Roles(Role.master, Role.admin)
  @UseGuards(RolesGuard)
  @UseGuards(AuthsGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  async getByPhone(@Param('phone') phone: string) {
    return this.modifyAccount(await this.userService.findByPhoneNumber(phone));
  }
  modifyAccount(user: Admin) {
    if (!user)
      return {
        survice: false,
        data: {},
      };
    return {
      survice: true,
      data: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        address: user.address,
        sex: user.sex,
        phoneNumber: user.phoneNumber,
        email: user.email,
        age: user.age,
        role: user.role,
        avatar: user.avatar,
      },
    };
  }
  @Put('/:id')
  @UseGuards(MyselfGuard)
  @Roles(Role.admin, Role.master, Role.user)
  @UseGuards(RolesGuard)
  @UseGuards(AuthsGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  async update(@Body() updateDto: UpdateUserDto) {
    return await this.userService.update(updateDto);
  }
}
