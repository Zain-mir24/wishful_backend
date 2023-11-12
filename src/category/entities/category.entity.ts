

import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { product } from 'src/Products/entities/product.entities';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

}