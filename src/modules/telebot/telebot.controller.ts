/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { TelebotService } from './telebot.service';
import { CreateTeleBotDto } from './dto/create-telebot.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auths/decorators/role.decorator';
import { Role } from '../user/interfaces/enum';
import { RolesGuard } from 'src/guards/role.guard';
import { AuthsGuard } from 'src/auths/auths.guard';
import { CreateMessageDto } from './dto/create-message.dto';
import { AskGptDto } from './dto/ask-gpt.dto';
@ApiTags('telebot')
@Controller('telebot')
export class TelebotController {
  constructor(private readonly telebotService: TelebotService) {}
  @Post('/')
  @UseGuards(RolesGuard)
  @UseGuards(AuthsGuard)
  @Roles(Role.master)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  public async createTelebot(@Body() createTeleBotDto: CreateTeleBotDto) {
    return createTeleBotDto;
  }
  @Post('/sendMessage')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.master, Role.admin)
  @UseGuards(RolesGuard)
  @UseGuards(AuthsGuard)
  @ApiBearerAuth()
  public async sendMessage(
    @Request() req,
    @Body() createMessageDto: CreateMessageDto,
  ) {
    return await this.telebotService.sendMessageByPhonenumber(
      {
        firstName: req?.payload?.firstName,
        lastName: req?.payload?.lastName,
        email: req?.payload?.email,
        phone: req?.payload?.phoneNumber,
        address: req?.payload?.address,
      },
      createMessageDto,
    );
  }
  @Post('/gpt')
  @HttpCode(HttpStatus.OK)
  public async askGPT(@Body() askGptDto: AskGptDto) {
    const res = await this.telebotService.askGpt(askGptDto.question);
    return {
      role: res.role,
      question: askGptDto.question,
      reply: res.content,
    };
  }
}
