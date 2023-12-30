import { EntityBase } from 'src/modules/base/entity.base';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'status' })
export class Status extends EntityBase {
  @Column({
    name: 'name',
    type: 'varchar',
    nullable: false,
    unique: true,
  })
  public name: string;
  @Column({
    name: 'value',
    type: 'boolean',
    default: false,
  })
  public value: boolean;
}
