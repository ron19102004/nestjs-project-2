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
import { FeedbackService } from './feedback.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { AuthsGuard } from 'src/auths/auths.guard';
import { RolesGuard } from 'src/guards/role.guard';
import { Roles } from 'src/auths/decorators/role.decorator';
import { MyselfGuard } from 'src/guards/myself.guard';
import { Role } from '../user/interfaces/enum';
import { CreateReplyFeedbackDto } from './dto/create-reply-feedback';

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
  @Post('/:id/reply_id=:reply_id&id_user_be_reply=:user_be_reply')
  @UseGuards(MyselfGuard)
  @Roles(Role.admin, Role.master, Role.user)
  @UseGuards(RolesGuard)
  @UseGuards(AuthsGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  async createReply(
    @Param('id') id: string,
    @Param('reply_id') reply_id: string,
    @Param('user_be_reply') user_be_reply: string,
    @Body() createReplyFeedbackDto: CreateReplyFeedbackDto,
  ) {
    return await this.feedbackService.createReply(
      parseInt(id + ''),
      parseInt(reply_id + ''),
      parseInt(user_be_reply + ''),
      createReplyFeedbackDto,
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
  @Delete('/:id/feedbackId=:feedback_id')
  @UseGuards(MyselfGuard)
  @Roles(Role.master, Role.admin)
  @UseGuards(RolesGuard)
  @UseGuards(AuthsGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  async delete(@Param('feedback_id') feedback_id: number) {
    if(isNaN(feedback_id)) return
    await this.feedbackService.delete(parseInt(feedback_id + ''));
  }
  @Get()
  async get() {
    return await this.feedbackService.findAll();
  }
  @Get('/reply_id=:reply_id')
  async getById(@Param('reply_id') reply_id: number) { 
    if(isNaN(reply_id)) return null;
    return await this.feedbackService.findAllReplyId(parseInt(reply_id+''));
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
