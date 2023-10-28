import { Module } from '@nestjs/common';
import { BookingAnalyticService } from './booking-analytic.service';
import { BookingAnalyticController } from './booking-analytic.controller';
import { BookingModule } from 'src/modules/booking/booking.module';

@Module({
  controllers: [BookingAnalyticController],
  providers: [BookingAnalyticService],
  imports: [BookingModule],
})
export class BookingAnalyticModule {}
