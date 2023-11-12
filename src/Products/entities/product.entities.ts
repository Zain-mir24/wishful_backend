import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('product')
export class product extends BaseEntity {
  @PrimaryGeneratedColumn({
    comment: 'The order unique identifier',
  })
  id: number;

  @Column({
    type: 'varchar',
  })
  title: string;

  @Column()
  description: string;

  @Column()
  categoryId: number;

  @Column()
  price: number;
}
