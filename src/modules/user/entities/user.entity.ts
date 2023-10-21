/* eslint-disable prettier/prettier */
import { Role, Sex } from '../interfaces/enum';
import { EntityBase } from 'src/modules/base/entity.base';
import { Column } from 'typeorm';

export class User extends EntityBase {
  @Column({
    name: 'email',
    type: 'varchar',
    length: 255,
    nullable: false,
    unique: true,
  })
  public email: string;
  @Column({
    name: 'phoneNumber',
    type: 'varchar',
    length: 255,
    nullable: false,
    unique: true,
  })
  public phoneNumber: string;
  @Column({
    name: 'firstName',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  public firstName: string;
  @Column({
    name: 'lastName',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  public lastName: string;
  @Column({
    name: 'address',
    type: 'text',
    nullable: false,
  })
  public address: string;
  @Column({
    name: 'role',
    type: 'varchar',
    enum: Role,
    default: Role.user,
  })
  public role: string;
  @Column({
    name: 'refresh_token',
    type: 'text',
    nullable: true,
  })
  public refresh_token: string;
  @Column({
    name: 'password',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  public password: string;
  @Column({
    name: 'avatar',
    type: 'text',
    nullable: true,
  })
  public avatar: string;  
  @Column({
    name: 'sex',
    enum: Sex,
    default: Sex.boy,
  })
  public sex: Sex;
  @Column({
    name: 'age',
    type: 'int',
    nullable: false,
  })
  public age: number;
  initUser(
    email: string,
    phoneNumber: string,
    firstName: string,
    lastName: string,
    address: string,
    password: string,
    sex: Sex,
    age: number,
  ) {
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.firstName = firstName;
    this.lastName = lastName;
    this.address = address;
    this.sex = sex;
    this.age = age;
    this.password = password;
  }
}
