/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { MessageService } from './message.service';
import { Roles } from 'src/auths/decorators/role.decorator';
import { Role } from '../user/interfaces/enum';
import { RolesGuard } from 'src/guards/role.guard';
import { AuthsGuard } from 'src/auths/auths.guard';
import { MyselfGuard } from 'src/guards/myself.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ResponseCustomModule } from 'src/helpers/response.help';
import { Message } from './entities/message.entity';
import { AuthsPayloads } from 'src/auths/gateways/auths-payload.gateway';
import { ActionSeenDto } from './dto/action-seen.dto';

@Controller('message')
@ApiTags('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}
  @Get('/myID=:id/take=:take&skip=:skip')
  @UseGuards(MyselfGuard)
  @Roles(Role.admin, Role.master, Role.user)
  @UseGuards(RolesGuard)
  @UseGuards(AuthsGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  async findByTakeSkip(
    @Param('id') id: number,
    @Param('take') take: number,
    @Param('skip') skip: number,
  ) {
    if (isNaN(id) || isNaN(take) || isNaN(skip))
      return ResponseCustomModule.error('Lỗi dữ liệu', 400);
    const messes = await this.messageService.findByIdLimit(id, take, skip);
    const result = messes.map((mess: Message) => {
      const { user, admin, ...item } = mess;
      const us = AuthsPayloads[Role.user].payload(user);
      const ad = AuthsPayloads[Role.admin].payload(admin);
      return {
        user: us,
        admin: ad,
        data: item,
      };
    });
    return ResponseCustomModule.ok(
      {
        result: result,
      },
      'oke',
    );
  }
  @Get('/myID=:id/seen-yet')
  @UseGuards(MyselfGuard)
  @Roles(Role.admin, Role.master, Role.user)
  @UseGuards(RolesGuard)
  @UseGuards(AuthsGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  async countSeenYet(@Param('id') id: number) {
    if (isNaN(id)) return ResponseCustomModule.error('Lỗi dữ liệu', 400);
    return await this.messageService.countSeenYet(id);
  }
  @Get('/myID=:id')
  @UseGuards(MyselfGuard)
  @Roles(Role.admin, Role.master, Role.user)
  @UseGuards(RolesGuard)
  @UseGuards(AuthsGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  async findByAllSeenYet(@Param('id') id: number) {
    if (isNaN(id)) return ResponseCustomModule.error('Lỗi dữ liệu', 400);
    const messes = await this.messageService.findByUserSeenYet(id);
    const result = messes.map((mess: Message) => {
      const { user, admin, ...item } = mess;
      const us = AuthsPayloads[Role.user].payload(user);
      const ad = AuthsPayloads[Role.admin].payload(admin);
      return {
        user: us,
        admin: ad,
        data: item,
      };
    });
    return ResponseCustomModule.ok(result, 'oke');
  }
  @Post('/myID=:id')
  @UseGuards(MyselfGuard)
  @Roles(Role.admin, Role.master, Role.user)
  @UseGuards(RolesGuard)
  @UseGuards(AuthsGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  async doSeen(@Body() action: ActionSeenDto) {
    return await this.messageService.action_seen(action);
  }
  @Post('/myID=:id/all')
  @UseGuards(MyselfGuard)
  @Roles(Role.admin, Role.master, Role.user)
  @UseGuards(RolesGuard)
  @UseGuards(AuthsGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  async doSeenAll(@Param('id') id: number) {
    if (isNaN(id)) return ResponseCustomModule.error('Lỗi dữ liệu', 400);
    return await this.messageService.action_seen_all(id);
  }
}
