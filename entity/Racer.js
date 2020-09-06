import {Entity, Column, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Racer {

    @PrimaryGeneratedColumn()    
    id

    @Column()
    name

    @Column()
    time

    @Column()
    discordUser
}

