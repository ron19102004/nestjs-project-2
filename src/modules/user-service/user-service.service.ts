import { Injectable } from '@nestjs/common';
import { CreateUserServiceDto } from './dto/create-user-service.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from '../user/user.service';
import { Repository } from 'typeorm';
import { Admin } from '../user/entities/admin.entity';
import { IResObj, ResponseCustomModule } from 'src/helpers/response.help';
import { Service } from '../service/entities/service.entity';
import { ServiceService } from '../service/service.service';
import { UserService as UserServiceEntity } from './entities/user-service.entity';

@Injectable()
export class UserServiceService {
  constructor(
    @InjectRepository(UserServiceEntity)
    private repository: Repository<UserServiceEntity>,
    private userService: UserService,
    private serviceService: ServiceService,
  ) {}
  async create(
    createUserServiceDto: CreateUserServiceDto,
  ): Promise<IResObj<UserServiceEntity>> {
    const admin: Admin = await this.userService.findById(
      createUserServiceDto.user_id,
    );
    if (!admin)
      return ResponseCustomModule.error('Không tìm thấy người dùng', 404);
    const service: Service = await this.serviceService.findById(
      createUserServiceDto.service_id,
    );
    if (!service)
      return ResponseCustomModule.error('Không tìm thấy dịch vụ', 404);
    const userServiceEntity: UserServiceEntity = new UserServiceEntity();
    userServiceEntity.admin = admin;
    userServiceEntity.service = service;
    const userServiceEntityNew: UserServiceEntity =
      await this.repository.save(userServiceEntity);
    return ResponseCustomModule.ok(
      userServiceEntityNew,
      'Thêm dịch vụ thành công',
    );
  }
  async find() {
    return await this.repository.find({
      relations: ['admin', 'service'],
      where: {
        deleted: false,
      },
    });
  }
  async findById(id: number): Promise<UserServiceEntity> {
    return await this.repository
      .createQueryBuilder('users_services')
      .leftJoinAndSelect('users_services.admin', 'admin')
      .leftJoinAndSelect('users_services.service', 'service')
      .where('users_services.id=:id', { id: id })
      .andWhere('users_services.deleted=:deleted', { deleted: false })
      .getOne();
  }
  async findByEmailAdmin(email: string): Promise<UserServiceEntity[]> {
    return await this.repository
      .createQueryBuilder('users_services')
      .leftJoinAndSelect('users_services.admin', 'admin')
      .leftJoinAndSelect('users_services.service', 'service')
      .where('users_services.admin.email=:email', { email: email })
      .andWhere('users_services.deleted=:deleted', { deleted: false })
      .getMany();
  }
  async findByIdAdmin(id: number): Promise<UserServiceEntity[]> {
    return await this.repository
      .createQueryBuilder('users_services')
      .leftJoinAndSelect('users_services.admin', 'admin')
      .leftJoinAndSelect('users_services.service', 'service')
      .where('users_services.admin.id=:id', { id: id })
      .andWhere('users_services.deleted=:deleted', { deleted: false })
      .getMany();
  }
  async findByIdService(id: number): Promise<UserServiceEntity[]> {
    return await this.repository
      .createQueryBuilder('users_services')
      .leftJoinAndSelect('users_services.admin', 'admin')
      .leftJoinAndSelect('users_services.service', 'service')
      .where('users_services.service.id=:id', { id: id })
      .andWhere('users_services.deleted=:deleted', { deleted: false })
      .getMany();
  }
  async remove(id: number) {
    const item = await this.repository.findOne({
      where: {
        id: id,
        deleted: false,
      },
    });
    item.deleted = true;
    await this.repository.save(item);
  }
}
