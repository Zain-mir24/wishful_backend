
import { PrimaryGeneratedColumn ,Column,Entity,OneToOne,JoinColumn} from "typeorm";
import { Event } from "src/events/entities/event.entity";
import { isString } from "class-validator";
@Entity('payment')
export class Payment {
    @PrimaryGeneratedColumn()
    pid:number;


    @Column({nullable:true})
    setup_intent:string

    @Column()
    amount:number


    @OneToOne(() => Event) // Define one-to-one relationship with Event entity
    @JoinColumn({ name: "event_id",referencedColumnName:"eid" })
    event: Event;
}
