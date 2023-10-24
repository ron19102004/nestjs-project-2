/* eslint-disable prettier/prettier */
import { EntityBase } from "src/modules/base/entity.base";
import { Admin } from "src/modules/user/entities/admin.entity";
import { Column, Entity, ManyToOne } from "typeorm";

@Entity({name:'messages'})
export class Message extends EntityBase{
    @Column({
        name:'sent',
        type: 'boolean',
        default: false,
    })
    public sent: boolean;
    @Column({
        name:'content',
        type:'text',
        nullable: false,
    })
    public content: string;
    @ManyToOne(()=>Admin,(a:Admin)=>a.messages)
    public admin:Admin
}
