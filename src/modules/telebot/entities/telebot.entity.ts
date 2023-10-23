/* eslint-disable prettier/prettier */
import { EntityBase } from 'src/modules/base/entity.base';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'telebot' })
export class Telebot extends EntityBase {
  @Column({
    name: 'title',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  public title: string;
  @Column({
    name: 'acronym',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  public acronym: string;
  @Column({
    name: 'content',
    type: 'text',
    nullable: false,
  })
  public content: string;
  @Column({
    name: 'link_pic',
    type: 'text',
    nullable: true,
  })
  public link_pic: string;
  toString() {
    return `
Tiêu đề: ${this.title}
Viết gọn: ${this.content}
Nội dung: ${this.link_pic}
Link ảnh: ${this.link_pic}
`;
  }
  toStringObject() {
    return `{
 "title": ${this.title},
 "acronym": ${this.acronym},
 "content": ${this.content},
 "link_pic": ${this.link_pic},
 "created": ${this.created_at},
 "deleted": ${this.deleted}
}`;
  }
}
