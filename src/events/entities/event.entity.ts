import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  OneToOne,
  ManyToOne,
} from 'typeorm';
import { SerializeOptions } from '@nestjs/common/serializer';
import { CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Payment } from 'src/payment/entities/payment.entity';
import { User } from 'src/users/entities/user.entity';
@Entity('event')
export class Event {
  @PrimaryGeneratedColumn()
  Eid: number;

  @Column({ type: 'timestamp'})
  date: string;

  @Column()
  event_name: string;

  @Column()
  image: string;

  @Column()
  event_description: string;

  @Column()
  gift_message: string;

  @Column()
  gift_amount: number;

  @Column()
  gift_from: string;

  @Column()
  country: string;

  @OneToOne(() => Payment, { nullable: true }) // Define a one-to-one relationship with Payment entity, nullable
  @JoinColumn({name:"payment_id",referencedColumnName:"Pid"})
  payment: Payment; // Define a property to hold the reference to Payment entity

  @ManyToOne(()=>User )
  @JoinColumn({name:"user_id",referencedColumnName: 'id'})
  owner:User;


  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  public updated_at: Date;
}
