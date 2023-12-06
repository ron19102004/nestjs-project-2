import { Injectable } from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { DepartmentService } from '../department/department.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Service } from './entities/service.entity';
import { Repository } from 'typeorm';
import { Department } from '../department/entities/department.entity';
import { ResponseCustomModule } from 'src/helpers/response.help';
import { UpdateServiceDto } from './dto/update-service.dto';

@Injectable()
export class ServiceService {
  constructor(
    private departmentService: DepartmentService,
    @InjectRepository(Service) private repository: Repository<Service>,
  ) {}
  async create(createServiceDto: CreateServiceDto) {
    const department: Department = await this.departmentService.findById(
      createServiceDto.department_id,
    );
    if (!department) {
      return ResponseCustomModule.error('Không tìm thấy KHOA', 404);
    }
    const service: Service = new Service();
    service.name = createServiceDto.name;
    service.department = department;
    service.description = createServiceDto.description;
    service.price = createServiceDto.price;
    const service_new: Service = await this.repository.save(service);
    return ResponseCustomModule.ok(service_new, 'Thêm dịch vụ thành công');
  }
  async findById(id: number): Promise<Service> {
    return await this.repository.findOne({
      relations: ['department'],
      where: {
        id: id,
        deleted: false,
      },
    });
  }
  async find() {
    return await this.repository
      .createQueryBuilder('services')
      .leftJoinAndSelect('services.department', 'department')
      .where('services.deleted=:deleted', { deleted: false })
      .getMany();
  }
  async delete(id: number) {
    const service: Service = await this.findById(id);
    service.deleted = true;
    await this.repository.save(service);
  }
  async update(updateDto: UpdateServiceDto) {
    const service: Service = await this.findById(updateDto.id);
    service.name = updateDto.name;
    service.price = updateDto.price;
    service.description = updateDto.description;
    await this.repository.save(service);
  }
}
