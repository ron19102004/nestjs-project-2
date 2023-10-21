/* eslint-disable prettier/prettier */
import { EntityBase } from "src/modules/base/entity.base";
import { Column, Entity } from "typeorm";

@Entity({ name: 'feedbacks' })
export class Feedback extends EntityBase {
    @Column({
        name: "subject",
        type: 'varchar',
        nullable: false,
        length: 255
    })
    public subject: string
    @Column({
        name: 'content',
        type: 'text',
        nullable: false
    })
    public content: string
}
