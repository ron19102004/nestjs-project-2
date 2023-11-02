/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Response,
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
  @Post()
  @UseGuards(MyselfGuard)
  @Roles(Role.admin, Role.master, Role.user)
  @UseGuards(RolesGuard)
  @UseGuards(AuthsGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  async create(@Response() req, @Body() createFeedbackDto: CreateFeedbackDto) {
    return await this.feedbackService.create(req.payload.id, createFeedbackDto);
  }
  @Get()
  async get() {
    return await this.feedbackService.findAll();
  }
}
