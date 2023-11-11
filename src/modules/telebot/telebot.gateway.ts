/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ConfigService } from '@nestjs/config';
import { TelebotService } from './telebot.service';
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
import OpenAI from 'openai';
import { Telegraf } from 'telegraf';
interface ITMess {
  from: {
    id: number;
    is_bot: boolean;
    first_name: string;
  };
  date: number;
}
export class TeleBotGateWay {
  public readonly bot$: Telegraf;
  private readonly handleActionTeleBot: HandleActionTeleBot;
  constructor(
    private readonly teleBotService: TelebotService,
    configService: ConfigService,
    userService: UserService,
    private readonly messageService: MessageService,
    private readonly gpt: OpenAI,
  ) {
    const token = configService.get('TOKEN_TELEGRAM');
    this.bot$ = new Telegraf(token);
    this.handleActionTeleBot = new HandleActionTeleBot(
      this.bot$,
      userService,
      teleBotService,
      messageService,
    );
    this.bot$.on('text', async (ctx) => await this.handleMessage(ctx.message));
    this.bot$.launch({
      dropPendingUpdates: false,
    });
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
    await this.bot$.telegram.sendMessage(
      msg_id,
      `Hello ${name_client}😎\n${teleBot[chosen].content}`,
    );
    if (teleBot[chosen].link_pic && teleBot[chosen].link_pic.length > 0)
      await this.bot$.telegram.sendPhoto(msg_id, teleBot[chosen].link_pic);
  }
  private async handleHelp(msg_id: number, name_client: string) {
    const teleBot: Telebot = await this.teleBotService.findOneByAcronym('help');
    await this.bot$.telegram.sendMessage(
      msg_id,
      `Hello ${name_client}😎\n${teleBot.content}`,
    );
    await this.bot$.telegram.sendPhoto(msg_id, teleBot.link_pic);
  }
  public async handleMessage(msg: any) {
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
        await this.handleStart(tele_user_id, tMess.from.first_name);
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
      case '/gpt': {
        const chatCompletion = await this.gpt.chat.completions.create({
          messages: [{ role: 'user', content: mess }],
          model: 'gpt-3.5-turbo-16k-0613',
        });
        await this.bot$.telegram.sendMessage(
          tele_user_id,
          `${chatCompletion.choices[0].message.role}: ${chatCompletion.choices[0].message.content}`,
        );
        break;
      }
      default: {
        await this.bot$.telegram.sendMessage(
          tele_user_id,
          '⚠️Câu lệnh của bạn không hợp lệ',
        );
      }
    }
  }
  public async sendMessage(messend: IMessageSend) {
    const message: Message = new Message();
    message.sent = false;
    message.user = messend.userReceive;
    message.admin = messend.userSend;
    message.content = messend.message;
    await this.messageService.save(message);
    await this.bot$.telegram
      .sendMessage(messend.id, messend.message)
      .then(async () => {
        message.sent = true;
        await this.messageService.save(message);
      })
      .catch((err) => {});
  }
}
export class HandleActionTeleBot {
  constructor(
    private readonly bot: Telegraf,
    private readonly userService: UserService,
    private readonly teleBotService: TelebotService,
    private readonly messageService: MessageService,
  ) {}
  public async callBackMessage(user: Admin) {
    const messages: Message[] = await this.messageService.findByUserSentYet(
      user.id,
    );
    if (messages.length === 0) return;
    const idTele: number = parseInt(user.teleID);
    for (const message of messages) {
      await this.bot.telegram.sendMessage(
        idTele,
        `🔔Thông báo bạn chưa nhận📢\n${message.content}`,
      );
      const msg: Message = message;
      msg.sent = true;
      await this.messageService.save(msg);
    }
  }
  public async login(tele_user_id: number, mess: string) {
    const userT: Admin = await this.userService.findByTeleID(`${tele_user_id}`);
    if (userT) {
      this.bot.telegram.sendMessage(
        tele_user_id,
        '⚠️Thiết bị này đã đăng nhập vào một tài khoản khác.Hãy nhập lệnh /logout để đăng xuất trước khi đăng nhập tài khoản mới',
      );
      return;
    }
    const account: string[] = mess.split(' ');
    if (account.length < 2) {
      this.bot.telegram.sendMessage(
        tele_user_id,
        `⚠️Vui lòng nhập mật khẩu. Thực hiện lại cú pháp: /login sodienthoai matkhau`,
      );
      return;
    }
    if (!ValidatorCustomModule.isPhoneNumber(account[0])) {
      this.bot.telegram.sendMessage(
        tele_user_id,
        '⚠️Số điện thoại không hợp lệ. Vui lòng nhập đúng cú pháp: /login sodienthoai matkhau',
      );
      return;
    }
    const user: Admin = await this.userService.findByPhoneNumber(account[0]);
    if (!user) {
      this.bot.telegram.sendMessage(
        tele_user_id,
        `⚠️Số điện thoại ${mess} chưa có trong hồ sơ của bênh viện.`,
      );
      return;
    }
    if (!HashCustomeModule.compare(account[1], user.password)) {
      this.bot.telegram.sendMessage(
        tele_user_id,
        `⚠️Mật khẩu không chính xác. Vui lòng đăng nhập lại`,
      );
      return;
    }
    if (user.teleID && user.teleID.length > 0) {
      const teleID_old = parseInt(user.teleID);
      this.bot.telegram.sendMessage(
        teleID_old,
        `⚠️Tài khoản đã đăng nhập vào thiết bị khác đăng xuất khỏi thiết bị của bạn vào lúc ${new Date()}.`,
      );
    }
    user.teleID = `${tele_user_id}`;
    await this.userService.save(user);
    this.bot.telegram
      .sendMessage(
        tele_user_id,
        `✅Đăng nhập thành công.\n🫴Chào mừng ${user.firstName} ${user.lastName}.`,
      )
      .then(async () => {
        await this.callBackMessage(user);
      });
  }
  public async info(tele_user_id: number) {
    const user: Admin = await this.userService.findByTeleID(`${tele_user_id}`);
    if (!user) {
      this.bot.telegram.sendMessage(
        tele_user_id,
        `⚠️Tài khoản này chưa đăng nhập hệ thống bệnh viện hoặc đã được đăng nhập ở thiết bị khác`,
      );
    } else {
      this.bot.telegram.sendMessage(tele_user_id, user.userToString());
    }
  }
  public async logout(tele_user_id: number) {
    const user: Admin = await this.userService.findByTeleID(`${tele_user_id}`);
    if (!user) {
      this.bot.telegram.sendMessage(
        tele_user_id,
        `📤Tài khoản này đã đăng xuất.\nVui lòng đăng nhập hệ thống bệnh viện`,
      );
    } else {
      user.teleID = '';
      await this.userService.save(user);
      this.bot.telegram.sendMessage(tele_user_id, '✅Đăng xuất thành công📤');
    }
  }
  public async addTelebot(tele_user_id: number, mess: string) {
    const userT: Admin = await this.userService.findByTeleID(`${tele_user_id}`);
    if (!userT) {
      this.bot.telegram.sendMessage(
        tele_user_id,
        `⚠️Tài khoản này chưa đăng nhập hệ thống bệnh viện hoặc đã được đăng nhập ở thiết bị khác`,
      );
      return;
    }
    if (!(userT.role === Role.admin || userT.role === Role.master)) {
      this.bot.telegram.sendMessage(
        tele_user_id,
        `⚠️Tài khoản này không có quyền sử dụng lệnh này.`,
      );
      return;
    }
    if (mess.charAt(0) !== '{' || mess.charAt(mess.length - 1) !== '}') {
      await this.bot.telegram.sendMessage(
        tele_user_id,
        `⚠️Lỗi định dạng. Để thêm telebot phải đúng định dạng như sau: {title,acronym,content,image}`,
      );
      return;
    }
    const value = mess.slice(1, mess.length - 1).split(',');
    if (value.length !== 4) {
      await this.bot.telegram.sendMessage(
        tele_user_id,
        `⚠️Lỗi nhập liệu. Phải đầy đủ title,acronym,content trong {title,acronym,content,image}.\nNếu không có image thì dữ liệu sẽ có dạng {title,acronym,content,}`,
      );
      return;
    }
    console.log(value);
    if (!(value[0] && value[1] && value[2])) {
      await this.bot.telegram.sendMessage(
        tele_user_id,
        `⚠️Lỗi nhập liệu. Phải đầy đủ title,acronym,content trong {title,acronym,content,image}`,
      );
      return;
    }
    if (
      value[3] &&
      value[3].length > 0 &&
      ValidatorCustomModule.isUrl(value[3]) === false
    ) {
      await this.bot.telegram.sendMessage(
        tele_user_id,
        `⚠️Lỗi định dạng.Thuộc tính image trong {title,acronym,content,image} không hợp lệ`,
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
    await this.bot.telegram.sendMessage(
      tele_user_id,
      `✅Đã tạo thành công một trường.\n${teleBotNew.toString()}`,
    );
  }
  public async getTeleBots(tele_user_id: number) {
    const userT: Admin = await this.userService.findByTeleID(`${tele_user_id}`);
    if (!userT) {
      this.bot.telegram.sendMessage(
        tele_user_id,
        `⚠️Tài khoản này chưa đăng nhập hệ thống bệnh viện hoặc đã được đăng nhập ở thiết bị khác`,
      );
      return;
    }
    if (!(userT.role === Role.admin || userT.role === Role.master)) {
      this.bot.telegram.sendMessage(
        tele_user_id,
        `⚠️Tài khoản này không có quyền sử dụng lệnh này.`,
      );
      return;
    }
    const telebots: Telebot[] = await this.teleBotService.find();
    const res: string = telebots
      .map((telebot: Telebot) => telebot.toStringObject())
      .join(',\n');
    await this.bot.telegram.sendMessage(
      tele_user_id,
      `✅Thông tin các telebot hiện có\n${res}`,
    );
  }
}
export interface IMessageSend {
  id: number;
  message: string;
  userReceive: Admin;
  userSend: Admin;
}
export interface IAdminSendMessage {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
}
