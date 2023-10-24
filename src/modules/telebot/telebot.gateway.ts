/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ConfigService } from '@nestjs/config';
import { TelebotService } from './telebot.service';
import * as TelegramBot from 'node-telegram-bot-api';
import { CharactorCustomeModule } from 'src/helpers/charactor.help';
import { ValidatorCustomModule } from 'src/helpers/validator.help';
import { UserService } from '../user/user.service';
import { Admin } from '../user/entities/admin.entity';
import { Telebot } from './entities/telebot.entity';
import { CreateTeleBotDto } from './dto/create-telebot.dto';
import { Role } from '../user/interfaces/enum';
import { HashCustomeModule } from 'src/helpers/hash.help';
import { MessageService } from '../message/message.service';
import { Message } from '../message/entities/message.entity';
interface ITMess {
  from: {
    id: number;
    is_bot: boolean;
    first_name: string;
  };
  date: number;
}
export class TeleBotGateWay {
  private bot: TelegramBot;
  private handleActionTeleBot: HandleActionTeleBot;
  constructor(
    private teleBotService: TelebotService,
    private configService: ConfigService,
    private userService: UserService,
    private messageService: MessageService,
  ) {
    const token = configService.get('TOKEN_TELEGRAM');
    this.bot = new TelegramBot(token, { polling: true });
    this.handleActionTeleBot = new HandleActionTeleBot(
      this.bot,
      userService,
      teleBotService,
      messageService,
    );
    this.bot.on(
      'message',
      async (message: TelegramBot.Message) => await this.handleMessage(message),
    );
  }
  private getRandomNumberInRange(a: number, b: number): number {
    const min = Math.min(a, b);
    const max = Math.max(a, b);
    const randomNumber = Math.random() * (max - min + 1) + min;
    return Math.floor(randomNumber);
  }
  private async handleStart(msg_id: number, name_client: string) {
    const teleBot: Telebot[] = await this.teleBotService.findByAcronym('start');
    let chosen: number = 0;
    if (teleBot.length > 1) {
      chosen = this.getRandomNumberInRange(0, teleBot.length);
    }
    await this.bot.sendMessage(
      msg_id,
      `Hello ${name_client}😎\n${teleBot[chosen].content}`,
    );
    if (teleBot[chosen].link_pic && teleBot[chosen].link_pic.length > 0)
      await this.bot.sendPhoto(msg_id, teleBot[chosen].link_pic);
  }
  private async handleHelp(msg_id: number, name_client: string) {
    const teleBot: Telebot = await this.teleBotService.findOneByAcronym('help');
    await this.bot.sendMessage(
      msg_id,
      `Hello ${name_client}😎\n${teleBot.content}`,
    );
    await this.bot.sendPhoto(msg_id, teleBot.link_pic);
  }
  public async handleMessage(msg: TelegramBot.Message) {
    const teleId: number = msg.chat.id;
    const charAt0: string = msg.text.charAt(0);
    if (charAt0 === '/') {
      const action: string = CharactorCustomeModule.charFirst(
        msg.text,
      ).toLowerCase();
      const message: string = msg.text
        .slice(action.length, msg.text.length)
        .trim();
      //add action to routes handle
      this.handleAction(action, message, teleId, {
        from: {
          id: msg.from.id,
          is_bot: msg.from.is_bot,
          first_name: msg.from.first_name,
        },
        date: msg.date,
      });
    }
  }
  private async handleAction(
    action: string,
    mess: string,
    tele_user_id: number,
    tMess: ITMess,
  ) {
    switch (action) {
      case '/':
      case '/help': {
        await this.handleHelp(tele_user_id, tMess.from.first_name);
        break;
      }
      case '/start': {
        this.handleStart(tele_user_id, tMess.from.first_name);
        break;
      }
      case '/login': {
        await this.handleActionTeleBot.login(tele_user_id, mess);
        break;
      }
      case '/logout': {
        await this.handleActionTeleBot.logout(tele_user_id);
        break;
      }
      case '/myinfo': {
        await this.handleActionTeleBot.info(tele_user_id);
        break;
      }
      case '/add-telebot': {
        await this.handleActionTeleBot.addTelebot(tele_user_id, mess);
        break;
      }
      case '/show-telebots': {
        await this.handleActionTeleBot.getTeleBots(tele_user_id);
        break;
      }
      default: {
        await this.bot.sendMessage(
          tele_user_id,
          'Câu lệnh của bạn không hợp lệ',
        );
      }
    }
  }
  public async sendMessage(messend: IMessageSend) {
    const message: Message = new Message();
    message.sent = false;
    message.admin = messend.userReceive;
    message.content = messend.message;
    await this.messageService.save(message);
    await this.bot
      .sendMessage(messend.id, messend.message)
      .then(async (value: TelegramBot.Message) => {
        message.sent = true;
        await this.messageService.save(message);
      })
      .catch((err) => {});
  }
}
export class HandleActionTeleBot {
  constructor(
    private bot: TelegramBot,
    private userService: UserService,
    private teleBotService: TelebotService,
    private messageService: MessageService,
  ) {}
  public async callBackMessage(user: Admin) {
    const messages: Message[] = await this.messageService.findByUserSentYet(
      user.id,
    );
    if (messages.length === 0) return;
    const idTele: number = parseInt(user.teleID);
    messages.forEach(async (message: Message) => {
      await this.bot.sendMessage(
        idTele,
        `🔔Thông báo bạn chưa nhận📢\n📢Thông báo🔔\n📩Tin nhắn đến bạn: ${message.content}`,
      );
      const msg: Message = message;
      msg.sent = true;
      await this.messageService.save(msg);
    });
  }
  public async login(tele_user_id: number, mess: string) {
    const userT: Admin = await this.userService.findByTeleID(`${tele_user_id}`);
    if (userT) {
      this.bot.sendMessage(
        tele_user_id,
        'Tài khoản này đã được đăng nhập ở thiết bị khác.\nBây giờ sẽ được đăng nhập tại thiết bị này và đăng xuất ở thiết bị đó.',
      );
    }
    const account: string[] = mess.split(' ');
    if (account.length < 2) {
      this.bot.sendMessage(
        tele_user_id,
        `Vui lòng nhập mật khẩu. Thực hiện lại cú pháp: /login sodienthoai matkhau`,
      );
      return;
    }
    if (!ValidatorCustomModule.isPhoneNumber(account[0])) {
      this.bot.sendMessage(
        tele_user_id,
        'Số điện thoại không hợp lệ. Vui lòng nhập đúng cú pháp: /login sodienthoai matkhau',
      );
      return;
    }
    const user: Admin = await this.userService.findByPhoneNumber(account[0]);
    if (!user) {
      this.bot.sendMessage(
        tele_user_id,
        `Số điện thoại ${mess} chưa có trong hồ sơ của bênh viện.`,
      );
      return;
    }
    if (!HashCustomeModule.compare(account[1], user.password)) {
      this.bot.sendMessage(
        tele_user_id,
        `‼️ Mật khẩu không chính xác. Vui lòng đăng nhập lại`,
      );
      return;
    }
    user.teleID = `${tele_user_id}`;
    await this.userService.save(user);
    this.bot.sendMessage(
      tele_user_id,
      `Chào mừng ${user.firstName} ${user.lastName} đến với bot của bệnh viện TD.`,
    );
    await this.callBackMessage(user);
  }
  public async info(tele_user_id: number) {
    const user: Admin = await this.userService.findByTeleID(`${tele_user_id}`);
    if (!user) {
      this.bot.sendMessage(
        tele_user_id,
        `Tài khoản này chưa đăng nhập hệ thống bệnh viện hoặc đã được đăng nhập ở thiết bị khác`,
      );
    } else {
      this.bot.sendMessage(tele_user_id, user.userToString());
    }
  }
  public async logout(tele_user_id: number) {
    const user: Admin = await this.userService.findByTeleID(`${tele_user_id}`);
    if (!user) {
      this.bot.sendMessage(
        tele_user_id,
        `Tài khoản này đã đăng xuất. Vui lòng đăng nhập hệ thống bệnh viện`,
      );
    } else {
      user.teleID = '';
      await this.userService.save(user);
      this.bot.sendMessage(tele_user_id, 'Đăng xuất thành công.');
    }
  }
  public async addTelebot(tele_user_id: number, mess: string) {
    const userT: Admin = await this.userService.findByTeleID(`${tele_user_id}`);
    if (!userT) {
      this.bot.sendMessage(
        tele_user_id,
        `Tài khoản này chưa đăng nhập hệ thống bệnh viện hoặc đã được đăng nhập ở thiết bị khác`,
      );
      return;
    }
    if (!(userT.role === Role.admin || userT.role === Role.master)) {
      this.bot.sendMessage(
        tele_user_id,
        `Tài khoản này không có quyền sử dụng lệnh này.`,
      );
      return;
    }
    if (mess.charAt(0) !== '{' || mess.charAt(mess.length - 1) !== '}') {
      await this.bot.sendMessage(
        tele_user_id,
        `Lỗi định dạng. Để thêm telebot phải đúng định dạng như sau: {title,acronym,content,image}`,
      );
      return;
    }
    const value = mess.slice(1, mess.length - 1).split(',');
    if (value.length !== 4) {
      await this.bot.sendMessage(
        tele_user_id,
        `Lỗi nhập liệu. Phải đầy đủ title,acronym,content trong {title,acronym,content,image}.\nNếu không có image thì dữ liệu sẽ có dạng {title,acronym,content,}`,
      );
      return;
    }
    console.log(value);
    if (!(value[0] && value[1] && value[2])) {
      await this.bot.sendMessage(
        tele_user_id,
        `Lỗi nhập liệu. Phải đầy đủ title,acronym,content trong {title,acronym,content,image}`,
      );
      return;
    }
    if (
      value[3] &&
      value[3].length > 0 &&
      ValidatorCustomModule.isUrl(value[3]) === false
    ) {
      await this.bot.sendMessage(
        tele_user_id,
        `Lỗi định dạng.Thuộc tính image trong {title,acronym,content,image} không hợp lệ`,
      );
      return;
    }
    const createTeleBotDto = new CreateTeleBotDto();
    createTeleBotDto.title = value[0];
    createTeleBotDto.acronym = value[1];
    createTeleBotDto.content = value[2];
    createTeleBotDto.link_pic = value[3];
    const teleBotNew: Telebot =
      await this.teleBotService.create(createTeleBotDto);
    await this.bot.sendMessage(
      tele_user_id,
      `Đã tạo thành công một trường.\n${teleBotNew.toString()}`,
    );
  }
  public async getTeleBots(tele_user_id: number) {
    const userT: Admin = await this.userService.findByTeleID(`${tele_user_id}`);
    if (!userT) {
      this.bot.sendMessage(
        tele_user_id,
        `Tài khoản này chưa đăng nhập hệ thống bệnh viện hoặc đã được đăng nhập ở thiết bị khác`,
      );
      return;
    }
    if (!(userT.role === Role.admin || userT.role === Role.master)) {
      this.bot.sendMessage(
        tele_user_id,
        `Tài khoản này không có quyền sử dụng lệnh này.`,
      );
      return;
    }
    const telebots: Telebot[] = await this.teleBotService.find();
    const res: string = telebots
      .map((telebot: Telebot) => telebot.toStringObject())
      .join(',\n');
    await this.bot.sendMessage(
      tele_user_id,
      `✅Thông tin các telebot hiện có\n${res}`,
    );
  }
}
export interface IMessageSend {
  id: number;
  message: string;
  userReceive: Admin;
}
