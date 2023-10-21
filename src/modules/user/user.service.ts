/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from './entities/admin.entity';
import { Repository } from 'typeorm';
import { IUserDto } from './dto/user-dto';
import { ResponseCustomModule } from 'src/helpers/response.help';
import { CreateUserDto } from './dto/create-user.dto';

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
  async findByEmail(email: string): Promise<Admin> {
    return await this.repository
      .createQueryBuilder('users')
      .leftJoinAndSelect('users.branch', 'branch')
      .leftJoinAndSelect('users.department', 'department')
      .where('users.email=:email', { email: email })
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
  async save(user: Admin): Promise<Admin> {
    return await this.repository.save(user);
  }
}
