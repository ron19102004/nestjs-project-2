import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Feedback } from './entities/feedback.entity';
import { Repository } from 'typeorm';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UserService } from '../user/user.service';
import { Admin } from '../user/entities/admin.entity';
import { ResponseCustomModule } from 'src/helpers/response.help';
import { AuthsPayloads } from 'src/auths/gateways/auths-payload.gateway';
import { CreateReplyFeedbackDto } from './dto/create-reply-feedback';
import { StatusService } from '../status/status.service';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(Feedback) private repository: Repository<Feedback>,
    private userService: UserService,
    private statusService: StatusService,
  ) {}
  async create(userId: number, createFeedbackDto: CreateFeedbackDto) {
    const user: Admin = await this.userService.findById(userId);
    if (!user)
      return ResponseCustomModule.error('Không tìm thấy người dùng', 404);
    const confirm_stt = await this.statusService.findByName('confirm_feedback');
    const feedback: Feedback = new Feedback();
    feedback.user = user;
    feedback.subject = createFeedbackDto.subject;
    feedback.content = createFeedbackDto.content;
    let mess = 'Đã gửi về hệ thống, chờ đội quản trị phê duyệt';
    if (confirm_stt && confirm_stt.value === false) {
      feedback.confirmed = true;
      mess = 'Đã thêm feedback thành công';
    }
    await this.repository.save(feedback);
    return ResponseCustomModule.ok(null, mess);
  }
  async createReply(
    userId: number,
    reply_id: number,
    user_be_reply: number,
    createReplyFeedbackDto: CreateReplyFeedbackDto,
  ) {
    const user: Admin = await this.userService.findById(userId);
    if (!user)
      return ResponseCustomModule.error('Không tìm thấy người dùng', 404);
    const userBe_reply: Admin = await this.userService.findById(user_be_reply);
    if (!userBe_reply)
      return ResponseCustomModule.error(
        'Không tìm thấy người dùng được phản hồi',
        404,
      );
    const feedBack: Feedback = await this.repository.findOne({
      where: { id: reply_id },
    });
    if (!feedBack)
      return ResponseCustomModule.error('Không tìm thấy phản hồi', 404);
    const confirm_stt = await this.statusService.findByName('confirm_feedback');
    const feedBackReply: Feedback = new Feedback();
    feedBackReply.content = createReplyFeedbackDto.content;
    feedBackReply.user = user;
    feedBackReply.subject = '';
    feedBackReply.reply_id = reply_id;
    feedBackReply.userBeReply = userBe_reply;
    let mess = 'Đã gửi về hệ thống, chờ đội quản trị phê duyệt';
    if (confirm_stt && confirm_stt.value === false) {
      feedBackReply.confirmed = true;
      mess = 'Đã thêm feedback thành công';
    }
    await this.repository.save(feedBackReply);
    return ResponseCustomModule.ok(null, mess);
  }
  async findAll() {
    const feedbacks: Feedback[] = await this.repository
      .createQueryBuilder('feedbacks')
      .leftJoinAndSelect('feedbacks.user', 'user')
      .where('feedbacks.deleted=:dl', { dl: false })
      .andWhere('user.role=:role', { role: 'user' })
      .andWhere('feedbacks.confirmed=:cf', { cf: true })
      .andWhere('feedbacks.reply_id=:reply_id', { reply_id: 0 })
      .orderBy('feedbacks.id', 'DESC')
      .getMany();
    const data = [];
    for (const feedback of feedbacks) {
      const { user, ...item } = feedback;
      data.push({
        user: AuthsPayloads[user.role].payload(user),
        data: item,
      });
    }
    return ResponseCustomModule.ok(data, 'Truy xuất thành công');
  }
  async findAllReplyId(id: number) {
    const feedbacks: Feedback[] = await this.repository
      .createQueryBuilder('feedbacks')
      .leftJoinAndSelect('feedbacks.user', 'user')
      .leftJoinAndSelect('feedbacks.userBeReply', 'userBeReply')
      .where('feedbacks.deleted=:dl', { dl: false })
      .andWhere('feedbacks.confirmed=:cf', { cf: true })
      .andWhere('feedbacks.reply_id=:reply_id', { reply_id: id })
      .orderBy('feedbacks.id', 'DESC')
      .getMany();
    const data = [];
    for (const feedback of feedbacks) {
      const { user, userBeReply, ...item } = feedback;
      data.push({
        user: AuthsPayloads[user.role].payload(user),
        userBeReply: AuthsPayloads[userBeReply.role].payload(userBeReply),
        data: item,
      });
    }
    return ResponseCustomModule.ok(data, 'Truy xuất thành công');
  }
  async findAllForAdmin() {
    // const feedbacks: Feedback[] = await this.repository
    //   .createQueryBuilder('feedbacks')
    //   .leftJoinAndSelect('feedbacks.user', 'user')
    //   .andWhere('feedbacks.deleted=:dl', { dl: false })
    //   .orderBy('feedbacks.id', 'DESC')
    //   .getMany();
    // const data = [];
    // for (const feedback of feedbacks) {
    //   const { user, ...item } = feedback;
    //   data.push({
    //     user: AuthsPayloads[user.role].payload(user),
    //     data: item,
    //   });
    // }
    // return ResponseCustomModule.ok(data, 'Truy xuất thành công');
    return await this.findAll();
  }
  async confirm(idFb: number) {
    const fb = await this.repository.findOne({
      where: {
        id: idFb,
        deleted: false,
        confirmed: false,
      },
    });
    if (!fb) return;
    fb.confirmed = true;
    await this.repository.save(fb);
  }
  async delete(idFb: number) {
    const fb = await this.repository.findOne({
      where: {
        id: idFb,
        deleted: false,
      },
    });
    if (!fb) return;
    fb.deleted = true;
    await this.repository.save(fb);
  }
}
