/* eslint-disable prettier/prettier */
import { Column, Entity, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Branch, Department } from 'src/modules';

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
}
