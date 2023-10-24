import { Module } from '@nestjs/common';
import { TelebotService } from './telebot.service';
import { TelebotController } from './telebot.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Telebot } from './entities/telebot.entity';
import { UserModule } from '../user/user.module';
import { MessageModule } from '../message/message.module';

@Module({
  controllers: [TelebotController],
  providers: [TelebotService],
  imports: [
    ConfigModule,
    UserModule,
    MessageModule,
    TypeOrmModule.forFeature([Telebot]),
  ],
  exports: [TelebotService],
})
export class TelebotModule {}
