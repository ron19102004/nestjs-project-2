import { EntityBase } from 'src/modules/base/entity.base';
import { Booking } from 'src/modules';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity({ name: 'process_booking' })
export class ProcessBooking extends EntityBase {
  @Column({
    name: 'time',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  public time: string;
  @Column({
    name: 'notes',
    type: 'text',
    nullable: true,
  })
  public notes: string;
  @Column({
    name: 'finished_at',
    type: 'date',
    nullable: true,
  })
  public finished_at: Date;
  @Column({
    name: 'finished',
    type: 'boolean',
    default: false,
  })
  public finished: boolean;
  @ManyToOne(() => Booking, (b: Booking) => b.processBookings)
  public booking: Booking;
}
