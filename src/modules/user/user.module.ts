import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from './entities/admin.entity';
import { Branch } from '../branch/entities/branch.entity';
import { Department } from '../department/entities/department.entity';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [TypeOrmModule.forFeature([Admin, Branch, Department])],
  exports: [UserService],
})
export class UserModule {}
