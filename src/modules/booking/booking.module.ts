import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from '../user/user.module';
import { TelebotModule } from '../telebot/telebot.module';
import { UserServiceModule } from '../user-service/user-service.module';

@Module({
  controllers: [BookingController],
  providers: [BookingService],
  imports: [
    TypeOrmModule.forFeature([Booking]),
    ConfigModule,
    UserModule,
    UserServiceModule,
    TelebotModule,
  ],
  exports: [BookingService],
})
export class BookingModule {}
