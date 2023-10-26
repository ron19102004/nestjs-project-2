/* eslint-disable prettier/prettier */
import { EntityBase } from 'src/modules/base/entity.base';
import { Admin, Branch, Service } from 'src/modules';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity({ name: 'departments' })
export class Department extends EntityBase {
  @Column({
    name: 'name',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  public name: string;
  @Column({
    name: 'duties',
    type: 'text',
    nullable: false,
  })
  public duties: string;
  @Column({
    name: 'description',
    type: 'text',
    nullable: true,
  })
  public description: string;
  @Column({
    name: 'equipment_system',
    type: 'text',
    nullable: true,
  })
  public equipment_system: string;
  @Column({
    name: 'treatment_techniques',
    type: 'text',
    nullable: true,
  })
  public treatment_techniques: string;
  @Column({
    name: 'avatar',
    type: 'text',
    nullable: true,
  })
  public avatar: string;
  //relationship
  @ManyToOne(() => Branch, (b: Branch) => b.departments)
  public branch: Branch;
  @OneToMany(() => Admin, (a: Admin) => a.department)
  public admin: Admin[];
  @OneToMany(() => Service, (s: Service) => s.department)
  public services: Service[];
}
