/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthsGuard } from 'src/auths/auths.guard';
import { RolesGuard } from 'src/guards/role.guard';
import { Roles } from 'src/auths/decorators/role.decorator';
import { Role } from '../user/interfaces/enum';
import { MyselfGuard } from 'src/guards/myself.guard';
import { Admin } from '../user/entities/admin.entity';
import { Booking } from './entities/booking.entity';
import { IDataBookingDto } from './dto/data-resp.dto';
import { AuthsPayloads } from 'src/auths/gateways/auths-payload.gateway';
import { ResponseCustomModule } from 'src/helpers/response.help';

@Controller('booking')
@ApiTags('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}
  @Post('/admin/:id')
  @UseGuards(MyselfGuard)
  @Roles(Role.admin, Role.master)
  @UseGuards(RolesGuard)
  @UseGuards(AuthsGuard)
  @ApiBearerAuth()
  async createForAdmin(@Body() createBookingDto: CreateBookingDto) {
    return await this.bookingService.createForAdmin(createBookingDto);
  }
  @Post('/user/:id')
  @UseGuards(MyselfGuard)
  @Roles(Role.admin, Role.master,Role.user)
  @UseGuards(RolesGuard)
  @UseGuards(AuthsGuard)
  @ApiBearerAuth()
  async createForUser(@Body() createBookingDto: CreateBookingDto) {
    return await this.bookingService.createForUser(createBookingDto);
  }
  @Post('/admin/id=:id&bookingID=:idBooking/accept')
  @UseGuards(MyselfGuard)
  @Roles(Role.admin, Role.master)
  @UseGuards(RolesGuard)
  @UseGuards(AuthsGuard)
  @ApiBearerAuth()
  async acceptForAdmin(@Request() req, @Param('idBooking') idBooking: number) {
    return await this.bookingService.acceptBookingByIdBookingForAdmin(
      {
        firstName: req?.payload?.firstName,
        lastName: req?.payload?.lastName,
        email: req?.payload?.email,
        phone: req?.payload?.phoneNumber,
        address: req?.payload?.address,
      },
      idBooking,
    );
  }
  @Post('/admin/id=:id&bookingID=:idBooking/reject')
  @UseGuards(MyselfGuard)
  @Roles(Role.admin, Role.master)
  @UseGuards(RolesGuard)
  @UseGuards(AuthsGuard)
  @ApiBearerAuth()
  async rejectForAdmin(@Request() req, @Param('idBooking') idBooking: number) {
    return await this.bookingService.rejectBookingByIdBookingForAdmin(
      {
        firstName: req?.payload?.firstName,
        lastName: req?.payload?.lastName,
        email: req?.payload?.email,
        phone: req?.payload?.phoneNumber,
        address: req?.payload?.address,
      },
      idBooking,
    );
  }
  @Post('/admin/id=:id&bookingID=:idBooking/finish')
  @UseGuards(MyselfGuard)
  @Roles(Role.admin, Role.master)
  @UseGuards(RolesGuard)
  @UseGuards(AuthsGuard)
  @ApiBearerAuth()
  async finishForAdmin(@Request() req, @Param('idBooking') idBooking: number) {
    return await this.bookingService.finishBookingByIdBookingForAdmin(
      {
        firstName: req?.payload?.firstName,
        lastName: req?.payload?.lastName,
        email: req?.payload?.email,
        phone: req?.payload?.phoneNumber,
        address: req?.payload?.address,
      },
      idBooking,
    );
  }
  private modifiesBookings(bookings: Booking[]): IDataBookingDto[] {
    const data: IDataBookingDto[] = [];
    for (const item of bookings) {
      const user: Admin = item.user;
      const admin: Admin = item.admin;
      data.push({
        service: item.service,
        admin: AuthsPayloads[admin.role].payload(admin),
        user: AuthsPayloads[user.role].payload(user),
        note: item.note,
        finished: item.finished,
        finished_at: item.finished_at,
        accepted: item.accepted,
        rejected: item.rejected,
      });
    }
    return data;
  }
  @Get('/user/:id')
  @UseGuards(MyselfGuard)
  @Roles(Role.admin, Role.master, Role.user)
  @UseGuards(RolesGuard)
  @UseGuards(AuthsGuard)
  @ApiBearerAuth()
  async showAllBookingForUser(@Param('id') id: number) {
    const booking: Booking[] =
      await this.bookingService.showAllBookingForUser(id);
    const data: IDataBookingDto[] = this.modifiesBookings(booking);
    return ResponseCustomModule.ok(
      data,
      'Lấy tất cả hồ sơ lịch hẹn thành công',
    );
  }
  @Get('/admin/:id')
  @UseGuards(MyselfGuard)
  @Roles(Role.admin, Role.master)
  @UseGuards(RolesGuard)
  @UseGuards(AuthsGuard)
  @ApiBearerAuth()
  async showAllBookingForAdmin(@Param('id') id: number) {
    const booking: Booking[] =
      await this.bookingService.showAllBookingForAdmin(id);
    const data: IDataBookingDto[] = this.modifiesBookings(booking);
    return ResponseCustomModule.ok(
      data,
      'Lấy tất cả hồ sơ lịch hẹn thành công',
    );
  }
  @Get('/admin/:id/accepted=:accepted&injected=:injected&finished=:finished')
  @UseGuards(MyselfGuard)
  @Roles(Role.admin, Role.master)
  @UseGuards(RolesGuard)
  @UseGuards(AuthsGuard)
  @ApiBearerAuth()
  async findManyWithConditionsForAdmin(
    @Param('id') id: number,
    @Param('accepted') accepted: boolean,
    @Param('injected') injected: boolean,
    @Param('finished') finished: boolean,
  ) {
    const booking: Booking[] =
      await this.bookingService.findManyByConditionsForAdmin(
        id,
        accepted,
        injected,
        finished,
      );
    const data: IDataBookingDto[] = this.modifiesBookings(booking);
    return ResponseCustomModule.ok(
      data,
      `Lấy tất cả hồ sơ lịch hẹn thành công theo điều kiện {accepted=${accepted};injected=${injected};finished=${finished}}`,
    );
  }
  @Get('/user/:id/accepted=:accepted&injected=:injected&finished=:finished')
  @UseGuards(MyselfGuard)
  @Roles(Role.admin, Role.master, Role.user)
  @UseGuards(RolesGuard)
  @UseGuards(AuthsGuard)
  @ApiBearerAuth()
  async findManyWithConditionsForUser(
    @Param('id') id: number,
    @Param('accepted') accepted: boolean,
    @Param('injected') injected: boolean,
    @Param('finished') finished: boolean,
  ) {
    const booking: Booking[] =
      await this.bookingService.findManyByConditionsForUser(
        id,
        accepted,
        injected,
        finished,
      );
    const data: IDataBookingDto[] = this.modifiesBookings(booking);
    return ResponseCustomModule.ok(
      data,
      `Lấy tất cả hồ sơ lịch hẹn thành công theo điều kiện {accepted=${accepted};injected=${injected};finished=${finished}}`,
    );
  }
}
