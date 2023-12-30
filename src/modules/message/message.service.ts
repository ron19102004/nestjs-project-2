/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { Repository } from 'typeorm';
import { ActionSeenDto } from './dto/action-seen.dto';
import { ResponseCustomModule } from 'src/helpers/response.help';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message) private repository: Repository<Message>,
  ) {}
  public async save(message: Message): Promise<Message> {
    return await this.repository.save(message);
  }
  public async saveMany(message: Message[]): Promise<Message[]> {
    return await this.repository.save(message);
  }
  public async findByUserSentYet(userId: number): Promise<Message[]> {
    return await this.repository
      .createQueryBuilder('messages')
      .leftJoinAndSelect('messages.user', 'admin')
      .where('messages.user.id=:idUser', { idUser: userId })
      .andWhere('messages.sent=:sent', { sent: false })
      .orderBy('messages.created_at', 'ASC')
      .getMany();
  }
  public async findByUserSeenYet(userId: number): Promise<Message[]> {
    return await this.repository
      .createQueryBuilder('messages')
      .leftJoinAndSelect('messages.user', 'admin')
      .where('messages.user.id=:idUser', { idUser: userId })
      .andWhere('messages.seen=:seen', { seen: false })
      .orderBy('messages.created_at', 'ASC')
      .getMany();
  }
  public async countSeenYet(userId: number): Promise<number> {
    return await await this.repository
      .createQueryBuilder('messages')
      .leftJoinAndSelect('messages.user', 'user')
      .where('user.id=:idUser', { idUser: userId })
      .andWhere('messages.seen=:seen', { seen: false })
      .getCount();
  }
  public async findByIdLimit(
    userId: number,
    take: number,
    skip: number,
  ): Promise<Message[]> {
    return await this.repository
      .createQueryBuilder('messages')
      .leftJoinAndSelect('messages.user', 'user')
      .leftJoinAndSelect('messages.admin', 'admin')
      .where('messages.user.id=:id', { id: userId })
      .orderBy('messages.id', 'DESC')
      .take(take)
      .skip(skip)
      .getMany();
  }
  public async action_seen_all(id_user: number) {
    try {
      await this.repository
        .createQueryBuilder('messages')
        .leftJoinAndSelect('messages.user', 'user')
        .where('messages.user.id=:id', { id: id_user })
        .update()
        .set({ seen: true })
        .execute();
      return ResponseCustomModule.ok(null, 'oke');
    } catch (error: any) {
      return ResponseCustomModule.error(error.message, 500);
    }
  }
  public async action_seen(actionSeenDto: ActionSeenDto) {
    try {
      actionSeenDto.id_mess.forEach(async (id: number) => {
        const mess = await this.repository.findOne({
          where: {
            id: id,
          },
        });
        if (mess && !mess.seen) {
          mess.seen = true;
          await this.repository.save(mess);
        }
      });
      return ResponseCustomModule.ok(null, 'oke');
    } catch (error: any) {
      return ResponseCustomModule.error(error.message, 500);
    }
  }
}
