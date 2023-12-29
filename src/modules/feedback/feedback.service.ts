import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Feedback } from './entities/feedback.entity';
import { Repository } from 'typeorm';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UserService } from '../user/user.service';
import { Admin } from '../user/entities/admin.entity';
import { ResponseCustomModule } from 'src/helpers/response.help';
import { AuthsPayloads } from 'src/auths/gateways/auths-payload.gateway';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(Feedback) private repository: Repository<Feedback>,
    private userService: UserService,
  ) {}
  async create(userId: number, createFeedbackDto: CreateFeedbackDto) {
    const user: Admin = await this.userService.findById(userId);
    if (!user)
      return ResponseCustomModule.error('Không tìm thấy người dùng', 404);
    const feedback: Feedback = new Feedback();
    feedback.user = user;
    feedback.subject = createFeedbackDto.subject;
    feedback.content = createFeedbackDto.content;
    await this.repository.save(feedback);
    return ResponseCustomModule.ok(null, 'Đã thêm feedback thành côn');
  }
  async findAll() {
    const feedbacks: Feedback[] = await this.repository
      .createQueryBuilder('feedbacks')
      .leftJoinAndSelect('feedbacks.user', 'user')
      .where('feedbacks.deleted=:dl', { dl: false })
      .andWhere('feedbacks.confirmed=:cf', { cf: true })
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
  async findAllForAdmin() {
    const feedbacks: Feedback[] = await this.repository
      .createQueryBuilder('feedbacks')
      .leftJoinAndSelect('feedbacks.user', 'user')
      .where('feedbacks.deleted=:dl', { dl: false })
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
