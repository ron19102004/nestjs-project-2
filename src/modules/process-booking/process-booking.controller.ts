import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ProcessBookingService } from './process-booking.service';
import { CreateProcessBookingDto } from './dto/create-process-booking.dto';
import { Roles } from 'src/auths/decorators/role.decorator';
import { MyselfGuard } from 'src/guards/myself.guard';
import { Role } from '../user/interfaces/enum';
import { RolesGuard } from 'src/guards/role.guard';
import { AuthsGuard } from 'src/auths/auths.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ResponseCustomModule } from 'src/helpers/response.help';
import { ProcessBooking } from './entities/process-booking.entity';

@Controller('process-booking')
@ApiTags('process-booking')
export class ProcessBookingController {
  constructor(private readonly processBookingService: ProcessBookingService) {}
  @Post('/admin/:id')
  @UseGuards(MyselfGuard)
  @Roles(Role.admin, Role.master)
  @UseGuards(RolesGuard)
  @UseGuards(AuthsGuard)
  @ApiBearerAuth()
  async create(@Body() createProcessBookingDto: CreateProcessBookingDto) {
    return await this.processBookingService.create(createProcessBookingDto);
  }
  @Get('/user/id:id&bookingId=:bookingId&finishedBooking=:finishedBooking')
  @UseGuards(MyselfGuard)
  @Roles(Role.admin, Role.master, Role.user)
  @UseGuards(RolesGuard)
  @UseGuards(AuthsGuard)
  @ApiBearerAuth()
  async findManyByIdBookingForUser(
    @Param('id') id: number,
    @Param('bookingId') bookingId: number,
    @Param('finishedBooking') finishedBooking: boolean,
  ) {
    const processBooking: ProcessBooking[] =
      await this.processBookingService.findManyByIdBookingForUser(
        id,
        bookingId,
        finishedBooking,
      );
    return ResponseCustomModule.ok(processBooking, 'Lấy thành công');
  }
  @Get('/admin/id:id&bookingId=:bookingId&finishedBooking=:finishedBooking')
  @UseGuards(MyselfGuard)
  @Roles(Role.admin, Role.master)
  @UseGuards(RolesGuard)
  @UseGuards(AuthsGuard)
  @ApiBearerAuth()
  async findManyByIdBookingForAdmin(
    @Param('id') id: number,
    @Param('bookingId') bookingId: number,
    @Param('finishedBooking') finishedBooking: boolean,
  ) {
    const processBooking: ProcessBooking[] =
      await this.processBookingService.findManyByIdBookingForAdmin(
        id,
        bookingId,
        finishedBooking,
      );
    return ResponseCustomModule.ok(processBooking, 'Lấy thành công');
  }
  @Get('/user/id:id&finishedProcess=:finished&finishedBooking=:finishedBooking')
  @UseGuards(MyselfGuard)
  @Roles(Role.admin, Role.master, Role.user)
  @UseGuards(RolesGuard)
  @UseGuards(AuthsGuard)
  @ApiBearerAuth()
  async findAllByIdConditionForUser(
    @Param('id') id: number,
    @Param('finished') finished: boolean,
    @Param('finishedBooking') finishedBooking: boolean,
  ) {
    const processBooking: ProcessBooking[] =
      await this.processBookingService.findManyByConditionsForUser(
        id,
        finished,
        finishedBooking,
      );
    return ResponseCustomModule.ok(processBooking, 'Lấy thành công');
  }
  @Get(
    '/admin/id:id&finishedProcess=:finished&finishedBooking=:finishedBooking',
  )
  @UseGuards(MyselfGuard)
  @Roles(Role.admin, Role.master)
  @UseGuards(RolesGuard)
  @UseGuards(AuthsGuard)
  @ApiBearerAuth()
  async findAllByIdConditionForAdmin(
    @Param('id') id: number,
    @Param('finished') finished: boolean,
    @Param('finishedBooking') finishedBooking: boolean,
  ) {
    const processBooking: ProcessBooking[] =
      await this.processBookingService.findManyByConditionsForAdmin(
        id,
        finished,
        finishedBooking,
      );
    return ResponseCustomModule.ok(processBooking, 'Lấy thành công');
  }
  @Put('/admin/id:id&processBookingId=:processBookingId')
  @UseGuards(MyselfGuard)
  @Roles(Role.admin, Role.master)
  @UseGuards(RolesGuard)
  @UseGuards(AuthsGuard)
  @ApiBearerAuth()
  async finish(
    @Param('id') id: number,
    @Param('processBookingId') processBookingId: number,
  ) {
    return await this.processBookingService.finishById(id, processBookingId);
  }
}
