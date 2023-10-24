import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';

@Module({
  controllers: [MessageController],
  providers: [MessageService],
  imports: [TypeOrmModule.forFeature([Message])],
  exports: [MessageService],
})
export class MessageModule {}
