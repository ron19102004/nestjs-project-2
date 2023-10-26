import { EntityBase } from 'src/modules/base/entity.base';
import { Admin, Service } from 'src/modules';
import { Entity, ManyToOne } from 'typeorm';

@Entity({ name: 'users_services' })
export class UserService extends EntityBase {
  @ManyToOne(() => Admin, (a: Admin) => a.userServices)
  public admin: Admin;
  @ManyToOne(() => Service, (s: Service) => s.userServices)
  public service: Service;
}
