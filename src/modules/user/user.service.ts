/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from './entities/admin.entity';
import { Repository } from 'typeorm';
import { IUserDto } from './dto/user-dto';
import { ResponseCustomModule } from 'src/helpers/response.help';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from './interfaces/enum';
import { UpdateInfoWorkDto } from './dto/update-info-work.dt';
import { UpdateBranchDepDto } from './dto/update-branch-dep.dto';
import { DepartmentService } from '../department/department.service';
import { BranchService } from '../branch/branch.service';
import { Department } from '../department/entities/department.entity';
import { Branch } from '../branch/entities/branch.entity';
import { ValidatorCustomModule } from 'src/helpers/validator.help';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Admin) private repository: Repository<Admin>,
    @InjectRepository(Department) private repositoryDep: Repository<Department>,
    @InjectRepository(Branch) private repositoryBra: Repository<Branch>,
  ) {}
  async createUser(userDto: IUserDto<CreateUserDto>) {
    const userByEmail: Admin = await this.findByEmail(userDto.entity().email);
    if (userByEmail)
      return ResponseCustomModule.error('Email already exists', 400);
    const userByPhone: Admin = await this.findByPhoneNumber(
      userDto.entity().phoneNumber,
    );
    if (userByPhone)
      return ResponseCustomModule.error('Phone number already exists', 400);
    //modify password
    const userModifies: Admin = await userDto.hash();
    //save the new user into database
    const user: Admin = await this.repository.save(userModifies);
    return ResponseCustomModule.ok(
      userDto.export(user),
      'User created successfully',
    );
  }
  async findAllAdmin() {
    return await this.repository
      .createQueryBuilder('users')
      .leftJoinAndSelect('users.branch', 'branch')
      .leftJoinAndSelect('users.department', 'department')
      .where('users.role!=:role', { role: 'user' })
      .andWhere('users.deleted=:deleted', { deleted: false })
      .getMany();
  }
  async findAdminById(id:number) {
    return await this.repository
      .createQueryBuilder('users')
      .leftJoinAndSelect('users.branch', 'branch')
      .leftJoinAndSelect('users.department', 'department')
      .where('users.role!=:role', { role: 'user' })
      .andWhere('users.id=:id', { id: id })
      .andWhere('users.deleted=:deleted', { deleted: false })
      .getOne();
  }
  
  async findAllAdminLimit(skip: number, take: number) {
    return await this.repository
      .createQueryBuilder('users')
      .leftJoinAndSelect('users.branch', 'branch')
      .leftJoinAndSelect('users.department', 'department')
      .where('users.role!=:role', { role: 'user' })
      .andWhere('users.deleted=:deleted', { deleted: false })
      .skip(skip ?? 0)
      .take(take ?? 5)
      .getMany();
  }
  async findAllUser() {
    return await this.repository
      .createQueryBuilder('users')
      .leftJoinAndSelect('users.branch', 'branch')
      .leftJoinAndSelect('users.department', 'department')
      .where('users.role=:role', { role: 'user' })
      .andWhere('users.deleted=:deleted', { deleted: false })
      .getMany();
  }
  async update(updateDto: UpdateUserDto) {
    const user: Admin = await this.findById(updateDto.id);
    if (!ValidatorCustomModule.isEmail(updateDto.email))
      return ResponseCustomModule.error('Email không hợp lệ', 400);
    if (!ValidatorCustomModule.isPhoneNumber(updateDto.phoneNumber))
      return ResponseCustomModule.error('Số điện thoại không hợp lệ', 400);
    if (updateDto.age > 100)
      return ResponseCustomModule.error(
        'Bạn không thể sống tới tuổi này. Thật vi diệu đấy',
        400,
      );
    if (!user)
      return ResponseCustomModule.error('Không tìm thấy người dùng', 404);
    if (user.email !== updateDto.email) {
      const userFindByEmail = await this.findByEmail(updateDto.email);
      if (userFindByEmail)
        return ResponseCustomModule.error('Email đã tồn tại', 400);
      user.email = updateDto.email;
    }
    user.address = updateDto.address;
    user.age = updateDto.age;
    user.sex = updateDto.sex;
    user.phoneNumber = updateDto.phoneNumber;
    user.firstName = updateDto.firstName;
    user.lastName = updateDto.lastName;
    user.avatar = updateDto.avatar;
    await this.repository.save(user);
    return ResponseCustomModule.ok(
      null,
      'Cập nhật thành công thông tin cá nhân.',
    );
  }
  async updateInfoWork(updateDto: UpdateInfoWorkDto) {
    const user: Admin = await this.findById(updateDto.id);
    if (!user)
      return ResponseCustomModule.error('Không tìm thấy người dùng', 404);
    user.position = updateDto.position;
    user.areas_of_expertise = updateDto.areas_of_expertise;
    user.member_of_organization = updateDto.member_of_organization;
    user.bio = updateDto.bio;
    await this.repository.save(user);
    return ResponseCustomModule.ok(
      null,
      'Cập nhật thành công thông tin công việc.',
    );
  }
  async departmentFindById(id: number): Promise<Department> {
    return await this.repositoryDep.findOne({
      relations: ['branch'],
      where: {
        id: id,
        deleted: false,
      },
    });
  }
  async branchFindById(id: number) {
    return await this.repositoryBra.findOne({
      where: {
        id: id,
        deleted: false,
      },
    });
  }
  async updateBranchDepartment(updateDto: UpdateBranchDepDto) {
    const user: Admin = await this.findById(updateDto.id);
    if (!user)
      return ResponseCustomModule.error('Không tìm thấy người dùng', 404);
    const department: Department = await this.departmentFindById(
      updateDto.department_id,
    );
    if (!department)
      return ResponseCustomModule.error('Không tìm thấy khoa', 404);
    const branch: Branch = await this.branchFindById(updateDto.branch_id);
    if (!branch)
      return ResponseCustomModule.error('Không tìm thấy chi nhánh', 404);
    if (department.branch.id !== branch.id)
      return ResponseCustomModule.error('Khoa không thuộc chi nhánh', 400);
    if (!user.department || user.department.id !== updateDto.department_id)
      user.department = department;
    if (!user.branch || user.branch.id !== updateDto.branch_id)
      user.branch = branch;
    await this.repository.save(user);
    return ResponseCustomModule.ok(
      null,
      'Cập nhật thành công thông tin trực thuộc.',
    );
  }
  async findByEmail(email: string): Promise<Admin> {
    return await this.repository
      .createQueryBuilder('users')
      .leftJoinAndSelect('users.branch', 'branch')
      .leftJoinAndSelect('users.department', 'department')
      .where('users.email=:email', { email: email })
      .andWhere('users.deleted=:deleted', { deleted: false })
      .getOne();
  }
  async findById(id: number): Promise<Admin> {
    return await this.repository
      .createQueryBuilder('users')
      .leftJoinAndSelect('users.branch', 'branch')
      .leftJoinAndSelect('users.department', 'department')
      .where('users.id=:id', { id: id })
      .andWhere('users.deleted=:deleted', { deleted: false })
      .getOne();
  }
  async findByPhoneNumber(phoneNumber: string): Promise<Admin> {
    return await this.repository
      .createQueryBuilder('users')
      .leftJoinAndSelect('users.branch', 'branch')
      .leftJoinAndSelect('users.department', 'department')
      .where('users.phoneNumber=:phoneNumber', { phoneNumber: phoneNumber })
      .andWhere('users.deleted=:deleted', { deleted: false })
      .getOne();
  }
  async findByTeleID(teleID: string): Promise<Admin> {
    return await this.repository
      .createQueryBuilder('users')
      .leftJoinAndSelect('users.branch', 'branch')
      .leftJoinAndSelect('users.department', 'department')
      .where('users.teleID=:teleID', { teleID: teleID })
      .andWhere('users.deleted=:deleted', { deleted: false })
      .getOne();
  }
  async save(user: Admin): Promise<Admin> {
    return await this.repository.save(user);
  }
  async upgradeRole(id: number) {
    const user: Admin = await this.findById(id);
    if (!user)
      return ResponseCustomModule.error('Không tìm thấy người dùng', 404);
    switch (user.role) {
      case Role.user: {
        user.role = Role.admin;
        break;
      }
      case Role.admin: {
        user.role = Role.master;
        break;
      }
      case Role.master: {
        user.role = Role.user;
        break;
      }
    }
    await this.repository.save(user);
    return ResponseCustomModule.ok(null, 'Nâng cấp thành công');
  }
}
