import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProcessBooking } from './entities/process-booking.entity';
import { Repository } from 'typeorm';
import { CreateProcessBookingDto } from './dto/create-process-booking.dto';
import { BookingService } from '../booking/booking.service';
import { Booking } from '../booking/entities/booking.entity';
import { ResponseCustomModule } from 'src/helpers/response.help';
import { TelebotService } from '../telebot/telebot.service';
@Injectable()
export class ProcessBookingService {
  constructor(
    @InjectRepository(ProcessBooking)
    private repository: Repository<ProcessBooking>,
    private bookingService: BookingService,
    private teleBotService: TelebotService,
  ) {}
  async create(createProcessBookingDto: CreateProcessBookingDto) {
    const booking: Booking = await this.bookingService.findById(
      createProcessBookingDto.bookingId,
      false,
      true,
      false,
    );
    if (!booking)
      return ResponseCustomModule.error(
        `Không tìm thấy lịch booking với ${createProcessBookingDto.bookingId}id {finished=false;accepted=false;rejected=false}`,
        404,
      );
    const processBooking: ProcessBooking = new ProcessBooking();
    processBooking.booking = booking;
    processBooking.notes = createProcessBookingDto.notes;
    processBooking.time = createProcessBookingDto.time;
    await this.repository.save(processBooking);
    await this.teleBotService.sendMessageByPhonenumber(null, {
      phoneNumber: booking.user.phoneNumber,
      message: `\n🔔Đây là thông báo tự động📩.
Hồ sơ lịch hẹn ${booking.id}id do ${
        booking.admin.lastName
      } quản lý xin thông báo:
1.Thời gian: ${processBooking.time}.
2:Ghi chú: ${processBooking.notes}.
Mọi chi tiết xin liên hệ tại mục quản lý của website: ${this.bookingService.getURL_FRONTEND()}`,
    });
    return ResponseCustomModule.ok(null, 'Thêm một xử lí lịch hẹn thành công');
  }
  async findById(id: number) {
    return await this.repository
      .createQueryBuilder('process_booking')
      .leftJoinAndSelect('process_booking.booking', 'booking')
      .where('process_booking.id=:id', { id: id })
      .andWhere('process_booking.booking.finished=:finished', {
        finished: false,
      })
      .andWhere('process_booking.deleted=:deleted', { deleted: false })
      .getOne();
  }
  async finishById(adminId: number, id: number) {
    const processBooking: ProcessBooking = await this.findById(id);
    if (!processBooking)
      return ResponseCustomModule.error('Không tìm thấy mục sử lí', 404);
    if (processBooking.booking.admin.id !== adminId)
      return ResponseCustomModule.forbidden(
        'Bạn không có quyền sửa đổi tại đây',
      );
    processBooking.finished = true;
    processBooking.finished_at = new Date();
    await this.repository.save(processBooking);
    await this.teleBotService.sendMessageByPhonenumber(null, {
      phoneNumber: processBooking.booking.user.phoneNumber,
      message: `\n🔔Đây là thông báo tự động📩.
Hồ sơ lịch hẹn ${processBooking.booking.id}id do ${
        processBooking.booking.admin.lastName
      } quản lý xin thông báo:
Buổi hẹn ${processBooking.time} đã kết thúc vào lúc ${
        processBooking.finished_at
      }.
Mọi chi tiết xin liên hệ tại mục quản lý của website: ${this.bookingService.getURL_FRONTEND()} .Xin cảm ơn❤️`,
    });
    return ResponseCustomModule.ok(null, 'Kết thúc thành công');
  }
  //for admin
  async findManyByConditionsForAdmin(
    adminId: number,
    finishedProcess: boolean,
    finishedBooking: boolean,
  ) {
    const processBookings: ProcessBooking[] = await this.repository
      .createQueryBuilder('process_booking')
      .leftJoinAndSelect('process_booking.booking', 'booking')
      .where('process_booking.finished=:finished', {
        finished: finishedProcess,
      })
      .andWhere('process_booking.deleted=:deleted', { deleted: false })
      .orderBy('process_booking.created_at', 'ASC')
      .getMany();
    const data: ProcessBooking[] = [];
    for (const item of processBookings) {
      const booking: Booking = await this.bookingService.findById(
        item.booking.id,
        finishedBooking,
        true,
        false,
      );
      if (booking && booking.admin.id + '' === adminId + '') {
        data.push(item);
      }
    }
    return data;
  }
  async findManyByIdBookingForAdmin(
    adminID: number,
    id: number,
    finishedBooking: boolean,
  ) {
    const processBookings: ProcessBooking[] = await this.repository
      .createQueryBuilder('process_booking')
      .leftJoinAndSelect('process_booking.booking', 'booking')
      .where('process_booking.booking.id=:id', { id: id })
      .andWhere('process_booking.deleted=:deleted', { deleted: false })
      .orderBy('process_booking.created_at', 'ASC')
      .getMany();
    const data: ProcessBooking[] = [];
    for (const item of processBookings) {
      const booking: Booking = await this.bookingService.findById(
        item.booking.id,
        finishedBooking,
        true,
        false,
      );
      if (booking && booking.admin.id + '' === adminID + '') {
        data.push(item);
      }
    }
    return data;
  }
  //for user
  async findManyByConditionsForUser(
    userID: number,
    finishedProcess: boolean,
    finishedBooking: boolean,
  ) {
    const processBookings: ProcessBooking[] = await this.repository
      .createQueryBuilder('process_booking')
      .leftJoinAndSelect('process_booking.booking', 'booking')
      .where('process_booking.finished=:finished', {
        finished: finishedProcess,
      })
      .andWhere('process_booking.deleted=:deleted', { deleted: false })
      .orderBy('process_booking.created_at', 'ASC')
      .getMany();
    const data: ProcessBooking[] = [];
    for (const item of processBookings) {
      const booking: Booking = await this.bookingService.findById(
        item.booking.id,
        finishedBooking,
        true,
        false,
      );
      if (booking && booking.user.id + '' === userID + '') {
        data.push(item);
      }
    }
    return data;
  }
  async findManyByIdBookingForUser(
    userID: number,
    id: number,
    finishedBooking: boolean,
  ) {
    const processBookings: ProcessBooking[] = await this.repository
      .createQueryBuilder('process_booking')
      .leftJoinAndSelect('process_booking.booking', 'booking')
      .where('process_booking.booking.id=:id', { id: id })
      .andWhere('process_booking.deleted=:deleted', { deleted: false })
      .orderBy('process_booking.created_at', 'ASC')
      .getMany();
    const data: ProcessBooking[] = [];
    for (const item of processBookings) {
      const booking: Booking = await this.bookingService.findById(
        item.booking.id,
        finishedBooking,
        true,
        false,
      );
      if (booking && booking.user.id + '' === userID + '') {
        data.push(item);
      }
    }
    return data;
  }
}
