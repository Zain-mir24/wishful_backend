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
export class Event {
  @PrimaryGeneratedColumn()
  Eid: number;

  @Column()
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
  gift_amount: string;

  @Column()
  gift_from: string;

  @Column()
  country: string;

  @OneToOne(() => Payment, { nullable: true }) // Define a one-to-one relationship with Payment entity, nullable
  @JoinColumn()
  Pid: Payment; // Define a property to hold the reference to Payment entity

  @ManyToOne(() => User, (user) => user.eventIds)
  @JoinColumn({ name: 'id' })
  user: User;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  public updated_at: Date;
}
