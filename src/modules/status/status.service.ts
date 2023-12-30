import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Status } from './entities/status.entity';
import { Repository } from 'typeorm';
import { CreateStatusDto } from './dto/create-status.dto';
import { ResponseCustomModule } from 'src/helpers/response.help';

@Injectable()
export class StatusService {
  public constructor(
    @InjectRepository(Status) private repository: Repository<Status>,
  ) {}
  async add(create: CreateStatusDto) {
    const byName = await this.findByName(create.name);
    if (byName) {
      return ResponseCustomModule.error('Trạng thái đã tồn tại', 400);
    }
    const newStatus = new Status();
    newStatus.name = create.name;
    newStatus.value = create.value;
    await this.repository.save(newStatus);
    return ResponseCustomModule.ok(null, 'Đã thêm trạng thái');
  }
  async findByName(name: string) {
    return await this.repository.findOne({
      where: { name: name, deleted: false },
    });
  }
  async findById(id: number) {
    return await this.repository.findOne({
      where: { id: id, deleted: false },
    });
  }
  async findAll() {
    return await this.repository.find({
      where: { deleted: false },
    });
  }

  async changeStatusByName(name: string) {
    const byName = await this.findByName(name);
    if (!byName) {
      return ResponseCustomModule.error('Trạng thái không tồn tại', 404);
    }
    byName.value = !byName.value;
    await this.repository.save(byName);
    return ResponseCustomModule.ok(null, 'Cập nhật thành công');
  }
  async changeStatusById(id: number) {
    const byId = await this.findById(id);
    if (!byId) {
      return ResponseCustomModule.error('Trạng thái không tồn tại', 404);
    }
    byId.value = !byId.value;
    await this.repository.save(byId);
    return ResponseCustomModule.ok(null, 'Cập nhật thành công');
  }
}
