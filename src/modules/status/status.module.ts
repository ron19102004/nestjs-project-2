import { Module } from '@nestjs/common';
import { StatusService } from './status.service';
import { StatusController } from './status.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Status } from './entities/status.entity';

@Module({
  controllers: [StatusController],
  providers: [StatusService],
  imports: [TypeOrmModule.forFeature([Status])],
  exports: [StatusService],
})
export class StatusModule {}
