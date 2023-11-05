import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  /**
   * this is function is used to create Order in Order Entity.
   * @param createOrderDto this will type of createOrderDto in which
   * we have defined what are the keys we are expecting from body
   * @returns promise of Order
   */

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const add = this.orderRepository.create(createOrderDto);
    return await this.orderRepository.save(add);
  }
  /**
   * this function is used to get all the Order's list
   * @returns promise of array of Orders
   */

  findAll(): Promise<Order[]> {
    return this.orderRepository.find();
  }

  /**
   * this function used to get data of use whose id is passed in parameter
   * @param id is type of number, which represent the id of Order.
   * @returns promise of Order
   */

  findOne(id: number) {
    return this.orderRepository.findOneBy({ id });
  }

  /**
   * this function used  update the order
   * @param id is type of number, which represent the id of Order.
   * @returns promise of Order
   */

  async update(id: number, updateOrderDto: UpdateOrderDto): Promise<Order> {
    await this.orderRepository.update(id, updateOrderDto);
    return this.orderRepository.findOne({ where: { id } });
  }
  /**
   * this function used to get data of use whose id is passed in parameter
   * @param id is type of number, which represent the id of Order.
   * @returns promise of Order
   */

  async remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
