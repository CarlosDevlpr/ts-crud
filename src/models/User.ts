import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm"

@Entity("User")
export class User {
    @PrimaryGeneratedColumn('increment')
    id: number

    @Column({ nullable: true })
    name: string

    @Column({ unique: true, nullable: false })
    email: string

    @Column({ nullable: false })
    phone: string

    @Column({ nullable: false })
    password: string

    @Column({ nullable: false, default: false })
    deleted: boolean

    @CreateDateColumn({name: 'created_at'})
    createdAt: Date

    @UpdateDateColumn({name: 'updated_at'})
    updatedAt: Date
}