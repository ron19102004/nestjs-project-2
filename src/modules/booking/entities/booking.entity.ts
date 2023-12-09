import { EntityBase } from 'src/modules/base/entity.base';
import { Admin } from 'src/modules';
import { Column, Entity, ManyToOne } from 'typeorm';
import { UserService } from 'src/modules/user-service/entities/user-service.entity';

@Entity('booking')
export class Booking extends EntityBase {
  @Column({
    name: 'note',
    type: 'text',
    nullable: true,
  })
  public note: string;
  @Column({
    name: 'finished_at',
    type: 'date',
    nullable: true,
  })
  public finished_at: Date;
  @Column({
    name: 'accepted',
    type: 'boolean',
    default: false,
  })
  public accepted: boolean;
  @Column({
    name: 'rejected',
    type: 'boolean',
    default: false,
  })
  public rejected: boolean;
  @Column({
    name: 'finished',
    type: 'boolean',
    default: false,
  })
  public finished: boolean;
  @Column({
    name: 'timeInit',
    type: 'varchar',
    nullable: false,
    length: 255,
  })
  public timeInit: string;
  @Column({
    name: 'code_number',
    type: 'int',
    nullable: false,
  })
  public code_number: number;
  @Column({
    name: 'confirm',
    type: 'boolean',
    default: false,
  })
  public confirm: boolean;
  @Column({
    name: 'appointment_date',
    type: 'varchar',
    nullable: false,
    length: 255,
  })
  public appointment_date: string;
  @ManyToOne(() => UserService, (s: UserService) => s.booking)
  public uService: UserService;
  @ManyToOne(() => Admin, (a: Admin) => a.bookingForAdmin)
  public admin: Admin;
  @ManyToOne(() => Admin, (a: Admin) => a.bookingForUser)
  public user: Admin;
}
