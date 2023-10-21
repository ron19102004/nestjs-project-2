/* eslint-disable prettier/prettier */
import { Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export class EntityBase {
    @PrimaryGeneratedColumn({
        name: "id"
    })
    public id: number
    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    public created_at: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    public updated_at: Date;
    @Column({
        name:"deleted",
        type:'boolean',
        default: false
    })
    public deleted: boolean;
}