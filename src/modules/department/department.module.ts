import { Module, forwardRef } from '@nestjs/common';
import { DepartmentService } from './department.service';
import { DepartmentController } from './department.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Department } from './entities/department.entity';
import { BranchModule } from '../branch/branch.module';

@Module({
  controllers: [DepartmentController],
  providers: [DepartmentService],
  imports: [
    TypeOrmModule.forFeature([Department]),
    forwardRef(() => BranchModule),
  ],
  exports: [DepartmentService],
})
export class DepartmentModule {}
