import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Department } from './entities/department.entity';
import { Repository } from 'typeorm';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { ResponseCustomModule } from 'src/helpers/response.help';
import { BranchService } from '../branch/branch.service';
import { Branch } from '../branch/entities/branch.entity';

@Injectable()
export class DepartmentService {
  constructor(
    @Inject(forwardRef(() => BranchService))
    private branchService: BranchService,
    @InjectRepository(Department) private repository: Repository<Department>,
  ) {}
  async create(createDepartmentDto: CreateDepartmentDto) {
    const branch: Branch = await this.branchService.findById(
      createDepartmentDto.branch_id,
    );
    if (!branch) return ResponseCustomModule.error('Không tìm thấy NHÁNH', 404);
    const department: Department = new Department();
    department.name = createDepartmentDto.name;
    department.duties = createDepartmentDto.duties;
    department.description = createDepartmentDto.description;
    department.equipment_system = createDepartmentDto.equipment_system;
    department.treatment_techniques = createDepartmentDto.treatment_techniques;
    department.avatar = createDepartmentDto.avatar;
    department.branch = branch;
    const department_new: Department = await this.repository.save(department);
    return ResponseCustomModule.ok(department_new, 'Thêm KHOA thành công');
  }
  async findById(id: number): Promise<Department> {
    return await this.repository
      .createQueryBuilder('departments')
      .leftJoinAndSelect('departments.branch', 'branch')
      .where('departments.id=:id', { id: id })
      .andWhere('departments.deleted=:deleted', { deleted: false })
      .getOne();
  }
  async findAll(): Promise<Department[]> {
    return await this.repository
      .createQueryBuilder('departments')
      .leftJoinAndSelect('departments.branch', 'branch')
      .andWhere('departments.deleted=:deleted', { deleted: false })
      .getMany();
  }
}
