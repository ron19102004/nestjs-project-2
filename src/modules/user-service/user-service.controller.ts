/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserServiceService } from './user-service.service';
import { CreateUserServiceDto } from './dto/create-user-service.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthsGuard } from 'src/auths/auths.guard';
import { RolesGuard } from 'src/guards/role.guard';
import { Roles } from 'src/auths/decorators/role.decorator';
import { Role } from '../user/interfaces/enum';
import { UserService } from './entities/user-service.entity';
import { ResponseCustomModule } from 'src/helpers/response.help';
import { Admin } from '../user/entities/admin.entity';
import { MyselfGuard } from 'src/guards/myself.guard';

@Controller('users-services')
@ApiTags('users-services')
export class UserServiceController {
  constructor(private readonly userServiceService: UserServiceService) {}
  @Post('')
  @ApiBearerAuth()
  @Roles(Role.master)
  @UseGuards(RolesGuard)
  @UseGuards(AuthsGuard)
  @HttpCode(HttpStatus.OK)
  async create(@Body() createUserServiceDto: CreateUserServiceDto) {
    return await this.userServiceService.create(createUserServiceDto);
  }
  @Delete('/:id')
  @ApiBearerAuth()
  @Roles(Role.master)
  @UseGuards(RolesGuard)
  @UseGuards(AuthsGuard)
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: number) {
    await this.userServiceService.remove(id);
  }
  @Get('')
  async getAll() {
    const uService: UserService[] = await this.userServiceService.find();
    const data = [];
    for (const item of uService) {
      const admin = this.modifyAccount(item.admin);
      data.push({
        id: item.id,
        admin: admin,
        service: item.service,
      });
    }
    return data;
  }
  @Get('/admin_id=:id')
  @UseGuards(MyselfGuard)
  @Roles(Role.admin, Role.master)
  @UseGuards(RolesGuard)
  @UseGuards(AuthsGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  async getAllByAdId(@Param('id') id: number) {
    const uService: UserService[] =
      await this.userServiceService.findByIdAdmin(id);
    const data = [];
    for (const item of uService) {
      const admin = this.modifyAccount(item.admin);
      data.push({
        id: item.id,
        admin: admin,
        service: item.service,
      });
    }
    return data;
  }
  modifyAccount(user: Admin) {
    if (!user) return null;
    return {
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
      bio: user?.bio,
      branch: {
        name: user?.branch?.name,
        hotline: user?.branch?.hotline,
        id: user?.branch?.id,
      },
      department: {
        name: user?.department?.name,
        id: user?.department?.id,
      },
      position: user.position,
      member_of_organization: user.member_of_organization,
      areas_of_expertise: user.areas_of_expertise,
    };
  }
  @Get('/admin/id')
  @HttpCode(HttpStatus.OK)
  async findByIdAdmin(@Param('id') id: number) {
    const userService: UserService[] =
      await this.userServiceService.findByIdAdmin(id);
    return ResponseCustomModule.ok(userService, 'Truy xuất thành công');
  }
  @Get('/admin/:email')
  @HttpCode(HttpStatus.OK)
  async findByEmailAdmin(@Param('email') email: string) {
    const userService: UserService[] =
      await this.userServiceService.findByEmailAdmin(email);
    return ResponseCustomModule.ok(userService, 'Truy xuất thành công');
  }
  @Get('/service/:id')
  @HttpCode(HttpStatus.OK)
  async findByIdService(@Param('id') id: number) {
    const userService: UserService[] =
      await this.userServiceService.findByIdService(id);
    return ResponseCustomModule.ok(userService, 'Truy xuất thành công');
  }
}
