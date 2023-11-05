import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('orders')
export class Order extends BaseEntity {
  @PrimaryGeneratedColumn({
    comment: 'The order unique identifier',
  })
  id: number;

  @Column({
    type: 'varchar',
  })
  title: string;

  @Column()
  address: string;

  @Column()
  status: string;

  @Column()
  price: number;
}
