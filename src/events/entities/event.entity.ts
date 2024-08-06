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
  eid: number;

  @Column({ type: 'timestamp'})
  date: string;

  @Column()
  event_name: string;

  @Column({nullable:true})
  event_url: string;

  @Column()
  image: string;

  @Column()
  event_description: string;

 
  @Column({nullable:true})
  amount_collected:number;


  @ManyToOne(()=>User )
  @JoinColumn({name:"userId",referencedColumnName: 'id'})
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
