import { EntityBase } from 'src/modules/base/entity.base';
import { Admin, Booking, Service } from 'src/modules';
import { Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity({ name: 'users_services' })
export class UserService extends EntityBase {
  @ManyToOne(() => Admin, (a: Admin) => a.userServices)
  public admin: Admin;
  @ManyToOne(() => Service, (s: Service) => s.userServices)
  public service: Service;
  @OneToMany(() => Booking, (b: Booking) => b.uService)
  public booking: Booking[];
}
