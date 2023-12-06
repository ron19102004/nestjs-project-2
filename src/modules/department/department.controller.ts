/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
  HttpCode,
  Put,
} from '@nestjs/common';
import { DepartmentService } from './department.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auths/decorators/role.decorator';
import { AuthsGuard } from 'src/auths/auths.guard';
import { RolesGuard } from 'src/guards/role.guard';
import { Role } from '../user/interfaces/enum';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@ApiTags('departments')
@Controller('departments')
export class DepartmentController {
  constructor(private departmentService: DepartmentService) {}
  @Post()
  @Roles(Role.master)
  @UseGuards(RolesGuard)
  @UseGuards(AuthsGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  async create(@Body() createDepartmentDto: CreateDepartmentDto) {
    return await this.departmentService.create(createDepartmentDto);
  }
  @Get()
  async get() {
    return await this.departmentService.findAll();
  }
  @Delete('/:id')
  @Roles(Role.master)
  @UseGuards(RolesGuard)
  @UseGuards(AuthsGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: number) {
    return await this.departmentService.delete(id);
  }
  @Put()
  @Roles(Role.master)
  @UseGuards(RolesGuard)
  @UseGuards(AuthsGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  async update(@Body() updateDepartmentDto: UpdateDepartmentDto) {
    return await this.departmentService.update(updateDepartmentDto);
  }
}
