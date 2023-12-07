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
  getURL_FRONTEND(): string {
    return this.URL_FRONTEND;
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
    const booking: Booking = new Booking();
    if (role !== Role.user) booking.accepted = true;
    booking.user = user;
    booking.admin = admin;
    booking.uService = uService;
    booking.note = createBookingDto.note;
    booking.timeInit = ValidatorCustomModule.getDate();
    const bookingNew: Booking = await this.repositoty.save(booking);
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
        message: `🔔Lịch hẹn ${bookingNew.id}id của ${user.lastName} với ${admin.firstName} ${admin.lastName} đã được tạo thành công. Vui lòng đăng nhập và kiểm tra trên website của chúng tôi: ${this.URL_FRONTEND}\n📝Ghi chú: ${bookingNew.note}`,
      },
    );
    return ResponseCustomModule.ok(bookingNew, 'Thêm hồ sơ thành công');
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
    let actionString: string = 'được chấp nhận';
    switch (action) {
      case EAction.ACCEPT: {
        booking.accepted = true;
        break;
      }
      case EAction.FINISH: {
        booking.finished = true;
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
      .andWhere('booking.deleted=:deleted', { deleted: false })
      .orderBy('booking.created_at', 'ASC')
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
    booking.deleted = true;
    await this.repositoty.save(booking);
  }
}
