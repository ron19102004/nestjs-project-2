import { Module } from '@nestjs/common';
import { UserServiceService } from './user-service.service';
import { UserServiceController } from './user-service.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceModule } from '../service/service.module';
import { UserModule } from '../user/user.module';
import { UserService } from './entities/user-service.entity';

@Module({
  controllers: [UserServiceController],
  providers: [UserServiceService],
  imports: [TypeOrmModule.forFeature([UserService]), UserModule, ServiceModule],
  exports: [UserServiceService],
})
export class UserServiceModule {}
