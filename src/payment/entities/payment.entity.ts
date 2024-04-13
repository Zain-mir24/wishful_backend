
import { PrimaryGeneratedColumn ,Column,Entity,OneToOne,JoinColumn} from "typeorm";
import { Event } from "src/events/entities/event.entity";
@Entity('payment')
export class Payment {
    @PrimaryGeneratedColumn()
    Pid:number;
    @Column()
    status:number   // 0 = unpaid, 1= paid, 2=scheduled
    
    @Column()
    card_number:number

    @Column({ type: 'timestamp'})
    Expiration:Date

    @Column()
    cvc:number

    @OneToOne(() => Event,(event)=>event.payment) // Define one-to-one relationship with Event entity
    @JoinColumn({ name: "event_id",referencedColumnName:"Eid" })
    event: Event;
}
