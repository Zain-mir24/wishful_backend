
import { PrimaryGeneratedColumn ,Column,Entity,OneToOne,JoinColumn} from "typeorm";
import { Event } from "src/events/entities/event.entity";
import { User } from "src/users/entities/user.entity";
import { isString } from "class-validator";
@Entity('payment')
export class Payment {
    @PrimaryGeneratedColumn()
    pid:number;

    @Column()
    country:string;

    @Column()
    gift_amount:number;
    
    @Column()
    gift_message:string;
    
    
    @OneToOne(() => User) // Define one-to-one relationship with Event entity
    @JoinColumn({ name: "userId",referencedColumnName:"id" })
    sender:number

    @OneToOne(() => Event) // Define one-to-one relationship with Event entity
    @JoinColumn({ name: "eventId",referencedColumnName:"eid" })
    event: Event;
}
