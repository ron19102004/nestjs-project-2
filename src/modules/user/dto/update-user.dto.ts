import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { Sex } from '../interfaces/enum';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  id: number;
  address: string;
  age: number;
  sex: Sex;
  phoneNumber: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar: string;
}
