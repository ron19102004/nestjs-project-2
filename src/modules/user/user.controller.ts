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
import { AuthsPayloads } from 'src/auths/gateways/auths-payload.gateway';
import { UpdateInfoWorkDto } from './dto/update-info-work.dt';
import { UpdateBranchDepDto } from './dto/update-branch-dep.dto';

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
  @Get('/allAdmin')
  @HttpCode(HttpStatus.OK)
  async getAllAdminForMaster() {
    const users: Admin[] = await this.userService.findAllAdmin();
    const data = [];
    for (const user of users) {
      data.push(AuthsPayloads[user.role].payload(user));
    }
    return data;
  }
  @Get('/allAdmin/skip=:skip&take=:take')
  @HttpCode(HttpStatus.OK)
  async getAllAdminTakeSkip(
    @Param('skip') skip: number,
    @Param('take') take: number,
  ) {
    const users: Admin[] = await this.userService.findAllAdminLimit(
      parseInt(skip + ''),
      parseInt(take + ''),
    );
    const data = [];
    for (const user of users) {
      data.push(AuthsPayloads[user.role].payload(user));
    }
    return data;
  }
  @Get('/master/allUser')
  @Roles(Role.master)
  @UseGuards(RolesGuard)
  @UseGuards(AuthsGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  async getAllUserForMaster() {
    const users: Admin[] = await this.userService.findAllUser();
    const data = [];
    for (const user of users) {
      data.push(AuthsPayloads[Role.admin].payload(user));
    }
    return data;
  }
  @Put('/master/user_id=:id/upgrade-role')
  @Roles(Role.master)
  @UseGuards(RolesGuard)
  @UseGuards(AuthsGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  async upgradeRole(@Param('id') id: number) {
    return await this.userService.upgradeRole(id);
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
  @Put('/update-infoself')
  @Roles(Role.master,Role.admin,Role.user)
  @UseGuards(RolesGuard)
  @UseGuards(AuthsGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  async updateInfoself(@Body() updateDto: UpdateUserDto) {
    return await this.userService.update(updateDto);
  }
  @Put('/master/update-branch-dep')
  @Roles(Role.master)
  @UseGuards(RolesGuard)
  @UseGuards(AuthsGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  async updateBranchDep(@Body() updateDto: UpdateBranchDepDto) {
    return await this.userService.updateBranchDepartment(updateDto);
  }
  @Put('/master/update-infowork')
  @Roles(Role.master)
  @UseGuards(RolesGuard)
  @UseGuards(AuthsGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  async updateInfowork(@Body() updateDto: UpdateInfoWorkDto) {
    return await this.userService.updateInfoWork(updateDto);
  }
}
