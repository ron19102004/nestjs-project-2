/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { BranchService } from './branch.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthsGuard } from 'src/auths/auths.guard';
import { RolesGuard } from 'src/guards/role.guard';
import { Roles } from 'src/auths/decorators/role.decorator';
import { Role } from '../user/interfaces/enum';

@ApiTags('branches')
@Controller('branches')
export class BranchController {
  constructor(private branchService: BranchService) {}
  @Post()
  @Roles(Role.master)
  @UseGuards(RolesGuard)
  @UseGuards(AuthsGuard)
  @ApiBearerAuth()
  async create(@Body() createBranchDto: CreateBranchDto) {
    return await this.branchService.create(createBranchDto);
  }
  @Get()
  async get() {
    return await this.branchService.findAll();
  }
}
