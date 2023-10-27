import { Booking, UserServiceEntity } from 'src/modules';
import { EntityBase } from 'src/modules/base/entity.base';
import { Department } from 'src/modules/department/entities/department.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity({ name: 'services' })
export class Service extends EntityBase {
  @Column({
    name: 'name',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  public name: string;
  @Column({
    name: 'description',
    type: 'text',
    nullable: true,
  })
  public description: string;
  @Column({
    name: 'price',
    type: 'integer',
    nullable: true,
  })
  public price: number;
  //relationships
  @ManyToOne(() => Department, (d: Department) => d.services)
  public department: Department;
  @OneToMany(() => UserServiceEntity, (u: UserServiceEntity) => u.service)
  public userServices: UserServiceEntity[];
  @OneToMany(() => Booking, (b: Booking) => b.service)
  public booking: Booking[];
}
