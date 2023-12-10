/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { AuthsGuard } from 'src/auths/auths.guard';
import { RolesGuard } from 'src/guards/role.guard';
import { Roles } from 'src/auths/decorators/role.decorator';
import { MyselfGuard } from 'src/guards/myself.guard';
import { Role } from '../user/interfaces/enum';

@ApiTags('feedbacks')
@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}
  @Post('/:id')
  @UseGuards(MyselfGuard)
  @Roles(Role.admin, Role.master, Role.user)
  @UseGuards(RolesGuard)
  @UseGuards(AuthsGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  async create(
    @Param('id') id: number,
    @Body() createFeedbackDto: CreateFeedbackDto,
  ) {
    return await this.feedbackService.create(
      parseInt(id + ''),
      createFeedbackDto,
    );
  }
  @Get('/:id/feedbackId=:feedback_id')
  @UseGuards(MyselfGuard)
  @Roles(Role.master, Role.admin)
  @UseGuards(RolesGuard)
  @UseGuards(AuthsGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  async confirm(@Param('feedback_id') feedback_id: number) {
    await this.feedbackService.confirm(parseInt(feedback_id + ''));
  }
  @Get()
  async get() {
    return await this.feedbackService.findAll();
  }
  @Get('/:id')
  @UseGuards(MyselfGuard)
  @Roles(Role.admin, Role.master)
  @UseGuards(RolesGuard)
  @UseGuards(AuthsGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  async findAllForAdmin() {
    return await this.feedbackService.findAllForAdmin();
  }
}
