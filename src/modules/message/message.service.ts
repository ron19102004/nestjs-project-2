/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { Repository } from 'typeorm';

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
}
