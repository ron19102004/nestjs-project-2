import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { Repository } from 'typeorm';
import { ServiceService } from '../service/service.service';
import { UserService } from '../user/user.service';
import { IResObj, ResponseCustomModule } from 'src/helpers/response.help';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Admin } from '../user/entities/admin.entity';
import { Service } from '../service/entities/service.entity';
import { TelebotService } from '../telebot/telebot.service';
import { IAdminSendMessage } from '../telebot/telebot.gateway';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BookingService {
  private URL_FRONTEND: string;
  constructor(
    @InjectRepository(Booking) private repositoty: Repository<Booking>,
    private serviceService: ServiceService,
    private userService: UserService,
    private teleBotService: TelebotService,
    private configService: ConfigService,
  ) {
    this.URL_FRONTEND = this.configService.get<string>('URL_FRONTEND');
  }
  getURL_FRONTEND(): string {
    return this.URL_FRONTEND;
  }
  async createForAdmin(
    createBookingDto: CreateBookingDto,
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
    const service: Service = await this.serviceService.findById(
      createBookingDto.service_id,
    );
    if (!service)
      return ResponseCustomModule.error('Không tìm thấy dịch vụ', 404);
    const booking: Booking = new Booking();
    booking.accepted = true;
    booking.user = user;
    booking.admin = admin;
    booking.service = service;
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
        message: `Lịch hẹn ${bookingNew.id}id của ${user.lastName} với ${admin.firstName} ${admin.lastName} đã được tạo thành công. Vui lòng chờ chấp nhập và kiểm tra trên website của chúng tôi: ${this.URL_FRONTEND}`,
      },
    );
    return ResponseCustomModule.ok(bookingNew, 'Thêm hồ sơ thành công');
  }
  async createForUser(
    createBookingDto: CreateBookingDto,
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
    const service: Service = await this.serviceService.findById(
      createBookingDto.user_id,
    );
    if (!service)
      return ResponseCustomModule.error('Không tìm thấy dịch vụ', 404);
    const booking: Booking = new Booking();
    booking.user = user;
    booking.admin = admin;
    booking.service = service;
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
        message: `Lịch hẹn ${bookingNew.id}id của ${user.lastName} với ${admin.firstName} ${admin.lastName} đã được tạo thành công. Vui lòng chờ chấp nhập và kiểm tra trên website của chúng tôi: ${this.URL_FRONTEND}`,
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
      .leftJoinAndSelect('booking.service', 'service')
      .where('booking.id=:id', { id: id })
      .andWhere('booking.finished=:finished', { finished: finished })
      .andWhere('booking.accepted=:accepted', { accepted: accepted })
      .andWhere('booking.rejected=:rejected', { rejected: rejected })
      .andWhere('booking.deleted=:deleted', { deleted: false })
      .getOne();
  }

  //function for admin
  async acceptBookingByIdBookingForAdmin(admin: IAdminSendMessage, id: number) {
    const booking: Booking = await this.findById(id, false, false, false);
    if (!booking)
      return ResponseCustomModule.error('Không tìm thấy hồ sơ người dùng', 404);
    booking.accepted = true;
    await this.repositoty.save(booking);
    await this.teleBotService.sendMessageByPhonenumber(admin, {
      phoneNumber: booking.user.phoneNumber,
      message: `Lịch hẹn ${booking.id}id của ${booking.user.lastName} với ${booking.admin.firstName} ${booking.admin.lastName} đã được chấp nhận. Vui lòng kiểm tra trên website của chúng tôi: ${this.URL_FRONTEND}`,
    });
    return ResponseCustomModule.ok(null, 'Chấp nhận thành công');
  }
  async rejectBookingByIdBookingForAdmin(admin: IAdminSendMessage, id: number) {
    const booking: Booking = await this.findById(id, false, false, false);
    if (!booking)
      return ResponseCustomModule.error('Không tìm thấy hồ sơ người dùng', 404);
    booking.rejected = true;
    await this.repositoty.save(booking);
    await this.teleBotService.sendMessageByPhonenumber(admin, {
      phoneNumber: booking.user.phoneNumber,
      message: `Lịch hẹn ${booking.id}id của ${booking.user.lastName} với ${booking.admin.firstName} ${booking.admin.lastName} đã bị từ chối. Vui lòng kiểm tra trên website của chúng tôi: ${this.URL_FRONTEND}`,
    });
    return ResponseCustomModule.ok(null, 'Chấp nhận thành công');
  }
  async finishBookingByIdBookingForAdmin(admin: IAdminSendMessage, id: number) {
    const booking: Booking = await this.findById(id, false, true, false);
    if (!booking)
      return ResponseCustomModule.error('Không tìm thấy hồ sơ người dùng', 404);
    booking.finished = true;
    await this.repositoty.save(booking);
    await this.teleBotService.sendMessageByPhonenumber(admin, {
      phoneNumber: booking.user.phoneNumber,
      message: `Lịch hẹn ${booking.id}id của ${booking.user.lastName} với ${booking.admin.firstName} ${booking.admin.lastName} đã được hoàn thành. Vui lòng kiểm tra trên website của chúng tôi: ${this.URL_FRONTEND}`,
    });
    return ResponseCustomModule.ok(null, 'Chấp nhận thành công');
  }
  async showAllBookingForAdmin(idAdmin: number) {
    return await this.repositoty
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.admin', 'admin')
      .leftJoinAndSelect('booking.user', 'user')
      .leftJoinAndSelect('booking.service', 'service')
      .where('booking.admin.id=:id', { id: idAdmin })
      .andWhere('booking.deleted=:deleted', { deleted: false })
      .orderBy('booking.created_at', 'ASC')
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
      .leftJoinAndSelect('booking.service', 'service')
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
      .leftJoinAndSelect('booking.service', 'service')
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
      .leftJoinAndSelect('booking.service', 'service')
      .where('booking.user.id=:id', { id: idUser })
      .andWhere('booking.finished=:finished', { finished: finished })
      .andWhere('booking.accepted=:accepted', { accepted: accepted })
      .andWhere('booking.rejected=:rejected', { rejected: rejected })
      .andWhere('booking.deleted=:deleted', { deleted: false })
      .orderBy('booking.created_at', 'ASC')
      .getMany();
  }
}
