import { Module } from '@nestjs/common';
import { ProcessBookingService } from './process-booking.service';
import { ProcessBookingController } from './process-booking.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProcessBooking } from './entities/process-booking.entity';
import { BookingModule } from '../booking/booking.module';
import { TelebotModule } from '../telebot/telebot.module';

@Module({
  controllers: [ProcessBookingController],
  providers: [ProcessBookingService],
  imports: [
    TypeOrmModule.forFeature([ProcessBooking]),
    BookingModule,
    TelebotModule,
  ],
})
export class ProcessBookingModule {}
