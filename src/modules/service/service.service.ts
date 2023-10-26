import { Injectable } from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { DepartmentService } from '../department/department.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Service } from './entities/service.entity';
import { Repository } from 'typeorm';
import { Department } from '../department/entities/department.entity';
import { ResponseCustomModule } from 'src/helpers/response.help';

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
}
