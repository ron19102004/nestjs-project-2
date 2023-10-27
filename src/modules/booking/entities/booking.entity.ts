import { EntityBase } from 'src/modules/base/entity.base';
import { Admin, ProcessBooking, Service } from 'src/modules';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

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
  @ManyToOne(() => Service, (s: Service) => s.booking)
  public service: Service;
  @ManyToOne(() => Admin, (a: Admin) => a.bookingForAdmin)
  public admin: Admin;
  @ManyToOne(() => Admin, (a: Admin) => a.bookingForUser)
  public user: Admin;
  @OneToMany(() => ProcessBooking, (p: ProcessBooking) => p.booking)
  public processBookings: ProcessBooking[];
}
