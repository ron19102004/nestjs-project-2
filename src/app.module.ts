import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { BranchModule } from './modules/branch/branch.module';
import { DepartmentModule } from './modules/department/department.module';
import { FeedbackModule } from './modules/feedback/feedback.module';
import { UserModule } from './modules/user/user.module';
import { AuthsModule } from './auths/auths.module';
import { TelebotModule } from './modules/telebot/telebot.module';
import { MessageModule } from './modules/message/message.module';
import { ServiceModule } from './modules/service/service.module';
import { UserServiceModule } from './modules/user-service/user-service.module';
import { BookingModule } from './modules/booking/booking.module';
import { ProcessBookingModule } from './modules/process-booking/process-booking.module';
import configs_custom from './configs/environment.config';
import typeormModuleOptionsCustom from './configs/database.config';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configs_custom],
    }),
    TypeOrmModule.forRoot(typeormModuleOptionsCustom),
    BranchModule,
    DepartmentModule,
    FeedbackModule,
    UserModule,
    AuthsModule,
    TelebotModule,
    MessageModule,
    ServiceModule,
    UserServiceModule,
    BookingModule,
    ProcessBookingModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
