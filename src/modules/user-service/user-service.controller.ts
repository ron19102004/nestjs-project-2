/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { UserServiceService } from './user-service.service';
import { CreateUserServiceDto } from './dto/create-user-service.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthsGuard } from 'src/auths/auths.guard';
import { RolesGuard } from 'src/guards/role.guard';
import { Roles } from 'src/auths/decorators/role.decorator';
import { Role } from '../user/interfaces/enum';
import { UserService } from './entities/user-service.entity';
import { ResponseCustomModule } from 'src/helpers/response.help';

@Controller('users-services')
@ApiTags('users-services')
export class UserServiceController {
  constructor(private readonly userServiceService: UserServiceService) {}
  @Post('')
  @ApiBearerAuth()
  @Roles(Role.master)
  @UseGuards(RolesGuard)
  @UseGuards(AuthsGuard)
  async create(@Body() createUserServiceDto: CreateUserServiceDto) {
    return await this.userServiceService.create(createUserServiceDto);
  }
  @Get('/admin/id')
  async findByIdAdmin(@Param('id') id: number) {
    const userService: UserService[] =
      await this.userServiceService.findByIdAdmin(id);
    return ResponseCustomModule.ok(userService, 'Truy xuất thành công');
  }
  @Get('/admin/:email')
  async findByEmailAdmin(@Param('email') email: string) {
    const userService: UserService[] =
      await this.userServiceService.findByEmailAdmin(email);
    return ResponseCustomModule.ok(userService, 'Truy xuất thành công');
  }
  @Get('/service/:id')
  async findByIdService(@Param('id') id: number) {
    const userService: UserService[] =
      await this.userServiceService.findByIdService(id);
    return ResponseCustomModule.ok(userService, 'Truy xuất thành công');
  }
}
