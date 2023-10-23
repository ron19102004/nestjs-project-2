/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Telebot } from './entities/telebot.entity';
import { Repository } from 'typeorm';
import { CreateTeleBotDto } from './dto/create-telebot.dto';
import { TeleBotGateWay } from './telebot.gateway';
import { UserService } from '../user/user.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { Admin } from '../user/entities/admin.entity';
import { ResponseCustomModule } from 'src/helpers/response.help';
@Injectable()
export class TelebotService {
  private telebotGateway: TeleBotGateWay;
  constructor(
    private configService: ConfigService,
    private userService: UserService,
    @InjectRepository(Telebot) private repository: Repository<Telebot>,
  ) {
    this.telebotGateway = new TeleBotGateWay(this, configService, userService);
  }
  public getTelebotGateway(): TeleBotGateWay {
    return this.telebotGateway;
  }
  public async create(createTeleBotDto: CreateTeleBotDto): Promise<Telebot> {
    return await this.repository.save(createTeleBotDto);
  }
  public async save(teleBot: Telebot) {
    return await this.create(teleBot);
  }
  public async remove(teleId: number) {
    const tele: Telebot = await this.findById(teleId);
    tele.deleted = true;
    this.save(tele);
  }
  public async findByAcronym(acronym: string): Promise<Telebot[]> {
    return await this.repository.find({
      where: {
        acronym: acronym,
        deleted: false,
      },
    });
  }
  public async findOneByAcronym(acronym: string): Promise<Telebot> {
    return await this.repository.findOne({
      where: {
        acronym: acronym,
        deleted: false,
      },
    });
  }
  public async findById(id: number): Promise<Telebot> {
    return await this.repository.findOne({
      where: {
        id: id,
        deleted: false,
      },
    });
  }
  public async find(): Promise<Telebot[]> {
    return await this.repository.find({
      where: {
        deleted: false,
      },
    });
  }
  async sendMessageByPhonenumber(
    user: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      address: string;
    },
    createMessageDto: CreateMessageDto,
  ) {
    const signature = `\n🚩Chử ký🚩
  Tên người gửi: ${user.firstName} ${user.lastName}
  Email: ${user.email}
  Số điện thoại: ${user.phone}
  Địa chỉ: ${user.address}
  Thời gian gửi: ${new Date()}
  `;
    const userReceive: Admin = await this.userService.findByPhoneNumber(
      createMessageDto.phoneNumber,
    );
    if (!userReceive) return ResponseCustomModule.error('User not found', 404);
    if (!userReceive.teleID || userReceive.teleID.length === 0)
      return ResponseCustomModule.error('User have not sign in yet', 408);
    await this.telebotGateway.sendMessage({
      id: parseInt(userReceive.teleID),
      message: `📢Thông báo🔔\n📩Tin nhắn đến bạn: ${createMessageDto.message}${signature}`,
    });
    return ResponseCustomModule.ok(null, 'Sent');
  }
}
