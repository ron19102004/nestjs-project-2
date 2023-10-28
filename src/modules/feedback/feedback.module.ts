import { Module } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { FeedbackController } from './feedback.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Feedback } from './entities/feedback.entity';
import { UserModule } from '../user/user.module';

@Module({
  controllers: [FeedbackController],
  providers: [FeedbackService],
  imports: [TypeOrmModule.forFeature([Feedback]), UserModule],
})
export class FeedbackModule {}
