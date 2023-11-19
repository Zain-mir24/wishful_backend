import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('orders')
export class Order extends BaseEntity {
  @PrimaryGeneratedColumn({
    comment: 'The order unique identifier',
  })
  id: number;

  @Column()
  address: string;

  @Column()
  status: string;

  @Column()
  price: number;

  @Column('simple-array')
  productId:number[];

  @Column()
  userId:number;
}
