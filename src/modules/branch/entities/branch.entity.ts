/* eslint-disable prettier/prettier */
import { EntityBase } from "src/modules/base/entity.base";
import { Admin, Department } from "src/modules";
import { Column, Entity, OneToMany } from "typeorm";

@Entity({
    name: "branches"
})
export class Branch extends EntityBase {
    @Column({
        name: 'name',
        type: 'varchar',
        length: 255,
        nullable: false
    })
    public name: string
    @Column({
        name: 'description',
        type: 'text',
        nullable: true
    })
    public description: string
    @Column({
        name: 'establish_at',
        type: 'date',
        nullable: true
    })
    public establish_at: Date
    @Column({
        name: 'src_map',
        type: 'text',
        nullable: true
    })
    public src_map: string
    @Column({
        name: 'address',
        type: 'text',
        nullable: false,
    })
    public address: string
    @Column({
        name: 'hotline',
        type: 'varchar',
        length: 255,
        nullable: false,
    })
    public hotline: string
    @Column({
        name: 'email',
        type: 'varchar',
        length: 255,
        nullable: false,
    })
    public email: string
    //relationship
    @OneToMany(() => Department, (d: Department) => d.branch)
    public departments: Department[]
    @OneToMany(() => Admin, (a: Admin) => a.branch)
    public admin: Admin[]
    //constructor
    public constructor(name: string, description: string, establish_at: Date, src_map: string, address: string, hotline: string, email: string) {
        super();
        this.name = name;
        this.description = description;
        this.establish_at = establish_at;
        this.src_map = src_map;
        this.address = address;
        this.hotline = hotline;
        this.email = email;
    }
    public toObject = () => ({
        name: this.name,
        description: this.description,
        establish_at: this.establish_at,
        src_map: this.src_map,
        address: this.address,
        hotline: this.hotline,
        email: this.email,
    })
}
