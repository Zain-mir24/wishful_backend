import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PageOptionsDto } from 'src/common/dtos';
import { PageDto } from 'src/common/page.dto';
import { PageMetaDto } from 'src/common/page.meta.dto';
import { orderSuccess } from './types';
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

  async findAll(
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<CreateOrderDto>> {
    try {
      const queryBuilder = this.orderRepository.createQueryBuilder('orders');

      queryBuilder
        .orderBy('orders.id', pageOptionsDto.order)
        .skip(pageOptionsDto.skip)
        .take(pageOptionsDto.pageSize);

      const itemCount = await queryBuilder.getCount();
      const { entities } = await queryBuilder.getRawAndEntities();

      const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

      return new PageDto(entities, pageMetaDto);
    } catch (e) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: e,
        },
        HttpStatus.FORBIDDEN,
        {
          cause: e,
        },
      );
    }
  }

  /**
   * this function is used to get order detail and products in a specific order
   * @param id is type of number, which represent the id of Order.
   * @returns promise of Order
   */

  findOne(id: number) {
    return this.orderRepository.findOneBy({ id });
  }

  /**
   * this function used  update the order status
   * @param id is type of number, which represent the id of Order.
   * @returns promise of Order
   */

  async update(
    id: number,
    updateOrderDto: UpdateOrderDto,
  ): Promise<orderSuccess> {
    try {
      const queryBuilder = this.orderRepository.createQueryBuilder('orders');
      queryBuilder
        .update('orders')
        .set({ status: updateOrderDto.status })
        .where('id = :id', { id: id })
        .execute();

      let order_found = await this.orderRepository.findOne({ where: { id } });
      console.log(order_found);

      if (!order_found) {
        throw new Error('User not found');
      }

      return {
        Message: 'Order updated SuccessFull',
        data: order_found,
      };
    } catch (e) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: e,
        },
        HttpStatus.FORBIDDEN,
        {
          cause: e,
        },
      );
    }
    // await this.orderRepository.update(id, updateOrderDto);
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
