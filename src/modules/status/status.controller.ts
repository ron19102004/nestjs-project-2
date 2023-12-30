import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { StatusService } from './status.service';
import { CreateStatusDto } from './dto/create-status.dto';
import { ResponseCustomModule } from 'src/helpers/response.help';
import { Role } from '../user/interfaces/enum';
import { Roles } from 'src/auths/decorators/role.decorator';
import { RolesGuard } from 'src/guards/role.guard';
import { AuthsGuard } from 'src/auths/auths.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('status')
@ApiTags('status')
export class StatusController {
  constructor(private readonly statusService: StatusService) {}
  @Post('/')
  @Roles(Role.master, Role.admin)
  @UseGuards(RolesGuard)
  @UseGuards(AuthsGuard)
  @ApiBearerAuth()
  async add(@Body() create: CreateStatusDto) {
    return await this.statusService.add(create);
  }
  @Get('/')
  async findAll() {
    return await this.statusService.findAll();
  }
  @Get('/id=:id')
  async findById(@Param('id') id: number) {
    if (isNaN(id)) return ResponseCustomModule.error('Lỗi id', 400);
    return await this.statusService.findById(parseInt(id + ''));
  }
  @Get('/name=:name')
  async findByName(@Param('name') name: string) {
    return await this.statusService.findByName(name);
  }
  @Put('/id=:id')
  @Roles(Role.master, Role.admin)
  @UseGuards(RolesGuard)
  @UseGuards(AuthsGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  async changeById(@Param('id') id: number) {
    if (isNaN(id)) return ResponseCustomModule.error('Lỗi id', 400);
    return await this.statusService.changeStatusById(parseInt(id + ''));
  }
  @Put('/name=:name')
  @Roles(Role.master, Role.admin)
  @UseGuards(AuthsGuard)
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  async changeByName(@Param('name') name: string) {
    return await this.statusService.changeStatusByName(name);
  }
}
