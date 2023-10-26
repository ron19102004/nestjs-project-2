/* eslint-disable prettier/prettier */
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Branch, Department, UserServiceEntity } from 'src/modules';
import { Message } from 'src/modules/message/entities/message.entity';

@Entity({ name: 'users' })
export class Admin extends User {
  @Column({
    name: 'bio',
    type: 'text',
    nullable: true,
  })
  public bio: string;
  @Column({
    name: 'position',
    type: 'varchar',
    nullable: true,
  })
  public position: string;
  @Column({
    name: 'member_of_organization',
    type: 'text',
    nullable: true,
  })
  public member_of_organization: string;
  @Column({
    name: 'areas_of_expertise',
    type: 'text',
    nullable: true,
  })
  public areas_of_expertise: string;
  //relationship
  @ManyToOne(() => Branch, (b: Branch) => b.admin)
  public branch: Branch;
  @ManyToOne(() => Department, (d: Department) => d.admin)
  public department: Department;
  @OneToMany(() => Message, (m: Message) => m.adminReceive)
  public messagesReceive: Message;
  @OneToMany(() => Message, (m: Message) => m.adminSend)
  public messagesSend: Message;
  @OneToMany(() => UserServiceEntity, (u: UserServiceEntity) => u.admin)
  public userServices: UserServiceEntity[];
  updateAdmin(
    branch: Branch,
    department: Department,
    bio: string,
    position: string,
    member_of_organization: string,
    areas_of_expertise: string,
  ) {
    this.position = position;
    this.member_of_organization = member_of_organization;
    this.areas_of_expertise = areas_of_expertise;
    this.bio = bio;
    this.department = department;
    this.branch = branch;
  }
  signature() {
    return `\n🚩Chử ký🚩
Tên người gửi: ${this.firstName} ${this.lastName}
Email: ${this.email}
Số điện thoại: ${this.phoneNumber}
Địa chỉ: ${this.address}
Thời gian gửi: ${new Date()}
`;
  }
  adminToString() {
    return ``;
  }
}
