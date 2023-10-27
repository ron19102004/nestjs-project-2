import { Module } from '@nestjs/common';
import { ServiceService } from './service.service';
import { ServiceController } from './service.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from './entities/service.entity';
import { DepartmentModule } from '../department/department.module';

@Module({
  controllers: [ServiceController],
  providers: [ServiceService],
  imports: [TypeOrmModule.forFeature([Service]), DepartmentModule],
  exports: [ServiceService],
})
export class ServiceModule {}
