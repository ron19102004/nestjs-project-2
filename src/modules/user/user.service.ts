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

@Injectable()
export class UserService {
  constructor(@InjectRepository(Admin) private repository: Repository<Admin>) {}
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
  async update(updateDto: UpdateUserDto) {
    const user: Admin = await this.findById(updateDto.id);
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
    return ResponseCustomModule.ok(null, 'Cập nhật thành công.');
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
}
