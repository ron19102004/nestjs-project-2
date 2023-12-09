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
  Put,
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
import { EAction, IDataBookingDto } from './dto/data-resp.dto';
import { AuthsPayloads } from 'src/auths/gateways/auths-payload.gateway';
import { ResponseCustomModule } from 'src/helpers/response.help';
import { ShowAllForAdminDto } from './dto/show-all-for-ad.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

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
  @HttpCode(HttpStatus.OK)
  async createForAdmin(@Body() createBookingDto: CreateBookingDto) {
    return await this.bookingService.create(createBookingDto, Role.admin);
  }
  @Post('/admin=:id/bookingID=:bid&code=:code')
  @UseGuards(MyselfGuard)
  @Roles(Role.admin, Role.master)
  @UseGuards(RolesGuard)
  @UseGuards(AuthsGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  async adminConfirm(
    @Param('id') id: number,
    @Param('bid') bid: number,
    @Param('code') code: number,
  ) {
    return await this.bookingService.adminConfirm(code, bid, id);
  }
  @Post('/admin=:id/bookingID=:bid/refresh-code')
  @UseGuards(MyselfGuard)
  @Roles(Role.admin, Role.master)
  @UseGuards(RolesGuard)
  @UseGuards(AuthsGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  async refreshCode(@Param('id') id: number, @Param('bid') bid: number) {
    return await this.bookingService.refreshCodeNumber(bid, id);
  }
  @Post('/user/:id')
  @UseGuards(MyselfGuard)
  @Roles(Role.admin, Role.master, Role.user)
  @UseGuards(RolesGuard)
  @UseGuards(AuthsGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  async createForUser(@Body() createBookingDto: CreateBookingDto) {
    return await this.bookingService.create(createBookingDto, Role.user);
  }
  @Post('/admin/id=:id&bookingID=:idBooking/action=:action')
  @UseGuards(MyselfGuard)
  @Roles(Role.admin, Role.master)
  @UseGuards(RolesGuard)
  @UseGuards(AuthsGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  async actionForAdmin(
    @Request() req,
    @Param('idBooking') idBooking: number,
    @Param('action') action: EAction,
  ) {
    return await this.bookingService.actionBookingByIdBookingForAdmin(
      {
        firstName: req?.payload?.firstName,
        lastName: req?.payload?.lastName,
        email: req?.payload?.email,
        phone: req?.payload?.phoneNumber,
        address: req?.payload?.address,
      },
      idBooking,
      action,
    );
  }
  private async modifiesBookings(
    bookings: Booking[],
  ): Promise<IDataBookingDto[]> {
    const data: IDataBookingDto[] = [];
    for (const item of bookings) {
      const user: Admin = item.user;
      const admin: Admin = item.admin;
      const uService = await this.bookingService
        .getuserServiceService()
        .findById(item.uService.id);
      const uServiceResult = {
        id: uService.id,
        service: uService.service,
      };
      data.push({
        id: item.id,
        uService: uServiceResult,
        admin: AuthsPayloads[admin.role].payload(admin),
        user: AuthsPayloads[user.role].payload(user),
        note: item.note,
        finished: item.finished,
        finished_at: item.finished_at,
        accepted: item.accepted,
        rejected: item.rejected,
        created_at: item.created_at,
        timeInit: item.timeInit,
        confirm: item.confirm,
        appointment_date: item.appointment_date,
      });
    }
    return data;
  }
  @Post('/user/all/:id')
  @UseGuards(MyselfGuard)
  @Roles(Role.admin, Role.master, Role.user)
  @UseGuards(RolesGuard)
  @UseGuards(AuthsGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  async showAllBookingForUser(@Param('id') id: number) {
    const booking: Booking[] =
      await this.bookingService.showAllBookingForUser(id);
    const data: IDataBookingDto[] =await this.modifiesBookings(booking);
    return ResponseCustomModule.ok(
      data,
      'Lấy tất cả hồ sơ lịch hẹn thành công',
    );
  }
  @Post('/admin/all/:id/deleted=:deleted')
  @UseGuards(MyselfGuard)
  @Roles(Role.admin, Role.master)
  @UseGuards(RolesGuard)
  @UseGuards(AuthsGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  async showAllBookingForAdmin(
    @Param('id') id: number,
    @Param('deleted') deleted: boolean,
    @Body() showAllForAdminDto: ShowAllForAdminDto,
  ) {
    const booking: Booking[] = await this.bookingService.showAllBookingForAdmin(
      id,
      showAllForAdminDto,
      deleted,
    );
    const data: IDataBookingDto[] = await this.modifiesBookings(booking);
    return ResponseCustomModule.ok(
      data,
      'Lấy tất cả hồ sơ lịch hẹn thành công',
    );
  }
  @Get('/admin/all/:id/deleted=:deleted')
  @UseGuards(MyselfGuard)
  @Roles(Role.admin, Role.master)
  @UseGuards(RolesGuard)
  @UseGuards(AuthsGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  async showAllBookingForAdminNotPagation(
    @Param('id') id: number,
    @Param('deleted') deleted: boolean,
  ) {
    const booking: Booking[] =
      await this.bookingService.showAllBookingForAdminNotSkipTake(id, deleted);
    const data: IDataBookingDto[] = await this.modifiesBookings(booking);
    return ResponseCustomModule.ok(
      data,
      'Lấy tất cả hồ sơ lịch hẹn thành công',
    );
  }
  @Get('/admin/:id/accepted=:accepted&rejected=:rejected&finished=:finished&confirmed=:confirmed/skip=:skip&take=:take')
  @UseGuards(MyselfGuard)
  @Roles(Role.admin, Role.master)
  @UseGuards(RolesGuard)
  @UseGuards(AuthsGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  async findManyWithConditionsForAdmin(
    @Param('id') id: number,
    @Param('accepted') accepted: boolean,
    @Param('rejected') rejected: boolean,
    @Param('finished') finished: boolean,
    @Param('confirmed') comfirmed: boolean,
    @Param('skip') skip: string,
    @Param('take') take: string,
  ) {
    const booking: Booking[] =
      await this.bookingService.findManyByConditionsForAdmin(
        id,
        finished,
        accepted,
        rejected,
        comfirmed,
        parseInt(take),
        parseInt(skip)
      );
    const data: IDataBookingDto[] = await this.modifiesBookings(booking);
    return ResponseCustomModule.ok(
      data,
      `Lấy tất cả hồ sơ lịch hẹn thành công theo điều kiện {accepted=${accepted};rejected=${rejected};finished=${finished}}`,
    );
  }
  @Get('/user/:id/accepted=:accepted&injected=:injected&finished=:finished')
  @UseGuards(MyselfGuard)
  @Roles(Role.admin, Role.master, Role.user)
  @UseGuards(RolesGuard)
  @UseGuards(AuthsGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  async findManyWithConditionsForUser(
    @Param('id') id: number,
    @Param('accepted') accepted: boolean,
    @Param('injected') injected: boolean,
    @Param('finished') finished: boolean,
  ) {
    const booking: Booking[] =
      await this.bookingService.findManyByConditionsForUser(
        id,
        finished,
        accepted,
        injected,
      );
    const data: IDataBookingDto[] = await this.modifiesBookings(booking);
    return ResponseCustomModule.ok(
      data,
      `Lấy tất cả hồ sơ lịch hẹn thành công theo điều kiện {accepted=${accepted};injected=${injected};finished=${finished}}`,
    );
  }
  @Delete('/admin/adminId=:id&bookingId=:bookingId')
  @UseGuards(MyselfGuard)
  @Roles(Role.admin, Role.master)
  @UseGuards(RolesGuard)
  @UseGuards(AuthsGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: number, @Param('bookingId') bookingId: number) {
    await this.bookingService.removeByIdBooking(bookingId);
    return ResponseCustomModule.ok(null, 'Xóa thành công');
  }
  @Put('/admin=:id/update-note')
  @UseGuards(MyselfGuard)
  @Roles(Role.admin, Role.master)
  @UseGuards(RolesGuard)
  @UseGuards(AuthsGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  async updateNote(@Body() updateNote:UpdateNoteDto,@Param('id') id:string){
    return await this.bookingService.updateNote(updateNote,id)
  }
}
