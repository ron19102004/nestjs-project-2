/* eslint-disable prettier/prettier */
import { EntityBase } from 'src/modules/base/entity.base';
import { Admin } from 'src/modules/user/entities/admin.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity({ name: 'feedbacks' })
export class Feedback extends EntityBase {
  @Column({
    name: 'subject',
    type: 'varchar',
    nullable: false,
    length: 255,
  })
  public subject: string;
  @Column({
    name: 'content',
    type: 'text',
    nullable: false,
  })
  public content: string;
  @ManyToOne(() => Admin, (a: Admin) => a.feedBacks)
  public user: Admin;
}
