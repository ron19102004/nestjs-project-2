import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from '../user/user.module';
import { ServiceModule } from '../service/service.module';
import { TelebotModule } from '../telebot/telebot.module';

@Module({
  controllers: [BookingController],
  providers: [BookingService],
  imports: [
    TypeOrmModule.forFeature([Booking]),
    ConfigModule,
    UserModule,
    ServiceModule,
    TelebotModule,
  ],
  exports: [BookingService],
})
export class BookingModule {}
