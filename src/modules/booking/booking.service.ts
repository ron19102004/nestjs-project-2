import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { IResObj, ResponseCustomModule } from 'src/helpers/response.help';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Admin } from '../user/entities/admin.entity';
import { TelebotService } from '../telebot/telebot.service';
import { IAdminSendMessage } from '../telebot/telebot.gateway';
import { ConfigService } from '@nestjs/config';
import { EAction } from './dto/data-resp.dto';
import { ShowAllForAdminDto } from './dto/show-all-for-ad.dto';
import { ValidatorCustomModule } from 'src/helpers/validator.help';
import { Role } from '../user/interfaces/enum';
import { UserServiceService } from '../user-service/user-service.service';
import { UserServiceEntity } from '..';
import { UpdateNoteDto } from './dto/update-note.dto';

@Injectable()
export class BookingService {
  private URL_FRONTEND: string;
  constructor(
    @InjectRepository(Booking) private repositoty: Repository<Booking>,
    private userServiceService: UserServiceService,
    private userService: UserService,
    private teleBotService: TelebotService,
    private configService: ConfigService,
  ) {
    this.URL_FRONTEND = this.configService.get<string>('URL_FRONTEND');
  }
  getRepository() {
    return this.repositoty;
  }
  getuserServiceService() {
    return this.userServiceService;
  }
  getURL_FRONTEND(): string {
    return this.URL_FRONTEND;
  }
  async countBookingAtDateAndService(date: string, id_service: number) {
    return await this.repositoty
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.uService', 'uservice')
      .where('booking.appointment_date=:date', { date: date })
      .andWhere('uservice.id=:id', { id: id_service })
      .andWhere('booking.accepted=:accepted', { accepted: true })
      .andWhere('booking.deleted=:deleted', { deleted: false })
      .getCount();
  }
  async create(
    createBookingDto: CreateBookingDto,
    role: Role,
  ): Promise<IResObj<Booking>> {
    const user: Admin = await this.userService.findById(
      createBookingDto.user_id,
    );
    if (!user)
      return ResponseCustomModule.error('Không tìm thấy người dùng', 404);
    const admin: Admin = await this.userService.findById(
      createBookingDto.admin_id,
    );
    if (!admin)
      return ResponseCustomModule.error('Không tìm thấy tài khoản admin', 404);
    const uService: UserServiceEntity = await this.userServiceService.findById(
      createBookingDto.user_service_id,
    );
    if (!uService)
      return ResponseCustomModule.error('Không tìm thấy dịch vụ', 404);
    const countBookingAtDate: number = await this.countBookingAtDateAndService(
      createBookingDto.appointment_date,
      createBookingDto.user_service_id,
    );
    if (countBookingAtDate > 100)
      return ResponseCustomModule.error(
        `Xin lỗi ! Vui lòng chọn ngày khác. Số lượng khách trong ngày ${createBookingDto.appointment_date} đã đạt 100 người`,
        400,
      );

    const booking: Booking = new Booking();
    if (role === Role.user) {
      booking.confirm = true;
    }
    booking.appointment_date = createBookingDto.appointment_date;
    booking.user = user;
    booking.admin = admin;
    booking.uService = uService;
    booking.note = createBookingDto.note;
    booking.timeInit = ValidatorCustomModule.getDate();
    booking.code_number = Math.floor(100000 + Math.random() * 900000);
    const bookingNew: Booking = await this.repositoty.save(booking);

    let mess: string = `🔔Lịch hẹn ${bookingNew.id}id của ${user.lastName} với ${admin.firstName} ${admin.lastName} đã được tạo thành công. Vui lòng kiểm tra trên hệ thống.
📝Ghi chú: ${bookingNew.note}`;
    if (role !== Role.user)
      mess = `🔔Lịch hẹn ${bookingNew.id}id của ${user.lastName} với ${admin.firstName} ${admin.lastName} đã được tạo thành công. Vui lòng cung cấp mã xác thực để nhân viên có thể xác thực hồ sơ.
🔢Mã xác thực: ${bookingNew.code_number}
📝Ghi chú: ${bookingNew.note}`;
    await this.teleBotService.sendMessageByPhonenumber(
      {
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        phone: admin.phoneNumber,
        address: admin.address,
      },
      {
        phoneNumber: user.phoneNumber,
        message: mess,
      },
    );
    return ResponseCustomModule.ok(bookingNew, 'Thêm hồ sơ thành công');
  }
  async adminConfirm(code: number, idBooking: number, idAdmin: number) {
    const booking: Booking = await this.findById(
      idBooking,
      false,
      false,
      false,
    );
    if (!booking)
      return ResponseCustomModule.error('Không tìm thấy hồ sơ', 404);
    if (booking.confirm === true)
      return ResponseCustomModule.error('Hồ sơ đã được xác thực', 400);
    if (booking.admin.id + '' !== idAdmin + '')
      return ResponseCustomModule.error(
        'Bạn không có quyền xác thực hồ sơ này',
        403,
      );
    if (booking.code_number + '' !== code + '')
      return ResponseCustomModule.error('Mã xác thực không hợp lệ', 403);
    booking.confirm = true;
    booking.accepted = true;
    await this.repositoty.save(booking);
    const admin = booking.admin;
    const user = booking.user;
    const mess: string = `🔔Lịch hẹn ${booking.id}id của ${user.lastName} với ${admin.firstName} ${admin.lastName} đã được xác thực. Vui lòng kiểm tra trên hệ thống.
📝Ghi chú: ${booking.note}`;
    await this.teleBotService.sendMessageByPhonenumber(
      {
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        phone: admin.phoneNumber,
        address: admin.address,
      },
      {
        phoneNumber: user.phoneNumber,
        message: mess,
      },
    );
    return ResponseCustomModule.ok(null, 'Xác thực thành công');
  }
  async refreshCodeNumber(bookingID: number, adminID: number) {
    const booking: Booking = await this.findById(
      bookingID,
      false,
      false,
      false,
    );
    if (!booking)
      return ResponseCustomModule.error('Không tìm thấy hồ sơ', 404);
    if (booking.confirm === true)
      return ResponseCustomModule.error('Hồ sơ đã được xác thực', 400);
    if (booking.admin.id + '' !== adminID + '')
      return ResponseCustomModule.error(
        'Bạn không có quyền xác thực hồ sơ này',
        403,
      );
    const code = Math.floor(100000 + Math.random() * 900000);
    booking.code_number = code;
    await this.repositoty.save(booking);
    const admin = booking.admin;
    const user = booking.user;
    const mess: string = `🔔Lịch hẹn ${booking.id}id của ${user.lastName} với ${admin.firstName} ${admin.lastName} đã được gửi lại mã xác thực như sau:
🔢Mã xác thực: ${booking.code_number}
📝Ghi chú: ${booking.note}`;
    await this.teleBotService.sendMessageByPhonenumber(
      {
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        phone: admin.phoneNumber,
        address: admin.address,
      },
      {
        phoneNumber: user.phoneNumber,
        message: mess,
      },
    );
    return ResponseCustomModule.ok(null, 'Xác gửi lại mã xác thực');
  }
  async findById(
    id: number,
    finished: boolean,
    accepted: boolean,
    rejected: boolean,
  ): Promise<Booking> {
    return await this.repositoty
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.admin', 'admin')
      .leftJoinAndSelect('booking.user', 'user')
      .leftJoinAndSelect('booking.uService', 'service')
      .where('booking.id=:id', { id: id })
      .andWhere('booking.finished=:finished', { finished: finished })
      .andWhere('booking.accepted=:accepted', { accepted: accepted })
      .andWhere('booking.rejected=:rejected', { rejected: rejected })
      .andWhere('booking.deleted=:deleted', { deleted: false })
      .getOne();
  }
  async findByIdUser(id: number): Promise<Booking> {
    return await this.repositoty
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.admin', 'admin')
      .leftJoinAndSelect('booking.user', 'user')
      .leftJoinAndSelect('booking.uService', 'service')
      .where('booking.user.id=:id', { id: id })
      .andWhere('booking.deleted=:deleted', { deleted: false })
      .getOne();
  }
  //function for admin
  async actionBookingByIdBookingForAdmin(
    admin: IAdminSendMessage,
    id: number,
    action: EAction,
  ) {
    let booking: Booking;
    switch (action) {
      case EAction.REJECT: {
        booking = await this.findById(id, false, false, false);
        break;
      }
      case EAction.ACCEPT: {
        booking = await this.findById(id, false, false, false);
        break;
      }
      case EAction.FINISH: {
        booking = await this.findById(id, false, true, false);
        break;
      }
    }
    if (!booking)
      return ResponseCustomModule.error('Không tìm thấy hồ sơ người dùng', 404);
    if (!booking.confirm)
      return ResponseCustomModule.error(
        'Hồ sơ chưa được xác thực. Vui lòng xác thực hồ sơ',
        403,
      );
    let actionString: string = 'được chấp nhận';
    switch (action) {
      case EAction.ACCEPT: {
        booking.accepted = true;
        break;
      }
      case EAction.FINISH: {
        booking.finished = true;
        booking.finished_at = new Date();
        actionString = 'được hoàn thành';
        break;
      }
      case EAction.REJECT: {
        booking.rejected = true;
        actionString = 'bị từ chối';
        break;
      }
    }
    await this.repositoty.save(booking);
    await this.teleBotService.sendMessageByPhonenumber(admin, {
      phoneNumber: booking.user.phoneNumber,
      message: `Lịch hẹn ${booking.id}id của ${booking.user.lastName} với ${booking.admin.firstName} ${booking.admin.lastName} đã ${actionString}. Vui lòng kiểm tra trên website của chúng tôi: ${this.URL_FRONTEND}`,
    });
    return ResponseCustomModule.ok(null, `Thao tác thành công`);
  }
  async showAllBookingForAdmin(
    idAdmin: number,
    showAllForAdminDto: ShowAllForAdminDto,
    deleted: boolean,
  ) {
    return await this.repositoty
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.admin', 'admin')
      .leftJoinAndSelect('booking.user', 'user')
      .leftJoinAndSelect('booking.uService', 'uService')
      .where('booking.admin.id=:id', { id: idAdmin })
      .andWhere('booking.deleted=:deleted', { deleted: deleted })
      .orderBy('booking.created_at', 'DESC')
      .skip(showAllForAdminDto.skip ?? 0)
      .take(showAllForAdminDto.take ?? 10)
      .getMany();
  }
  async showAllBookingForAdminNotSkipTake(idAdmin: number, deleted: boolean) {
    return await this.repositoty
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.admin', 'admin')
      .leftJoinAndSelect('booking.user', 'user')
      .leftJoinAndSelect('booking.uService', 'service')
      .where('booking.admin.id=:id', { id: idAdmin })
      .andWhere('booking.deleted=:deleted', { deleted: deleted })
      .orderBy('booking.created_at', 'DESC')
      .getMany();
  }
  async findManyByConditionsForAdmin(
    idAdmin: number,
    finished: boolean,
    accepted: boolean,
    rejected: boolean,
    confirmed: boolean,
    take: number,
    skip: number,
  ) {
    return await this.repositoty
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.admin', 'admin')
      .leftJoinAndSelect('booking.user', 'user')
      .leftJoinAndSelect('booking.uService', 'service')
      .where('booking.admin.id=:id', { id: idAdmin })
      .andWhere('booking.finished=:finished', { finished: finished })
      .andWhere('booking.accepted=:accepted', { accepted: accepted })
      .andWhere('booking.rejected=:rejected', { rejected: rejected })
      .andWhere('booking.confirm=:confirm', { confirm: confirmed })
      .andWhere('booking.deleted=:deleted', { deleted: false })
      .orderBy('booking.created_at', 'ASC')
      .skip(skip)
      .take(take)
      .getMany();
  }
  async showAllBookingForUser(idUser: number) {
    return await this.repositoty
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.admin', 'admin')
      .leftJoinAndSelect('booking.user', 'user')
      .leftJoinAndSelect('booking.uService', 'service')
      .where('booking.user.id=:id', { id: idUser })
      .andWhere('booking.deleted=:deleted', { deleted: false })
      .orderBy('booking.created_at', 'ASC')
      .getMany();
  }
  async findManyByConditionsForUser(
    idUser: number,
    finished: boolean,
    accepted: boolean,
    rejected: boolean,
  ) {
    return await this.repositoty
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.admin', 'admin')
      .leftJoinAndSelect('booking.user', 'user')
      .leftJoinAndSelect('booking.uService', 'service')
      .where('booking.user.id=:id', { id: idUser })
      .andWhere('booking.finished=:finished', { finished: finished })
      .andWhere('booking.accepted=:accepted', { accepted: accepted })
      .andWhere('booking.rejected=:rejected', { rejected: rejected })
      .andWhere('booking.deleted=:deleted', { deleted: false })
      .orderBy('booking.created_at', 'ASC')
      .getMany();
  }
  async removeByIdBooking(id: number) {
    const booking: Booking = await this.repositoty.findOne({
      where: {
        id: id,
        deleted: false,
      },
    });
    if (!booking) return;
    booking.deleted = true;
    await this.repositoty.save(booking);
  }
  async updateNote(updateNoteDto: UpdateNoteDto, admin_id: string) {
    const booking: Booking = await this.repositoty.findOne({
      relations: ['admin'],
      where: {
        id: updateNoteDto.booking_id,
        deleted: false,
      },
    });
    if (!booking)
      return ResponseCustomModule.error('Không tìm thấy hồ sơ', 404);
    if (booking.admin.id + '' !== admin_id + '')
      return ResponseCustomModule.error(
        'Bạn không có quyền thay đổi ghi chú',
        403,
      );
    booking.note = updateNoteDto.note;
    await this.repositoty.save(booking);
    return ResponseCustomModule.ok(null, 'Cập nhật thành công');
  }
}
