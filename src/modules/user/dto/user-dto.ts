/* eslint-disable prettier/prettier */
import { HashCustomeModule } from 'src/helpers/hash.help';
import { Admin } from '../entities/admin.entity';
import { CreateUserDto } from './create-user.dto';
export interface IUserDto<CreateEntityDto> {
  hash(): Promise<Admin>;
  export(user: Admin): any;
  entity(): CreateEntityDto;
}
export  class UserDto implements IUserDto <CreateUserDto>{
  constructor(private createUserDto: CreateUserDto) {}
  entity(): CreateUserDto {
    return this.createUserDto;
  }
  export(user: Admin) {
    return {
      firstName: user.firstName,
      lastName: user.lastName,
      address: user.address,
      sex: user.sex,
      phoneNumber: user.phoneNumber,
      email: user.email,
      age: user.age,
      role: user.role,
      avatar: user.avatar,
      refresh_token: user.refresh_token,
    };
  }
  async hash(): Promise<Admin> {
    const passHash: string = await HashCustomeModule.password(
      this.createUserDto.password,
    );
    this.createUserDto.password = passHash;
    const user: Admin = this.createUserDto as Admin;
    user.avatar = 'https://cdn-icons-png.flaticon.com/512/3177/3177440.png';
    return user;
  }
}
