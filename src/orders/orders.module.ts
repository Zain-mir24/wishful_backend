import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ClassSerializerInterceptor } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { product } from 'src/Products/entities/product.entities';
import { ProductsService } from 'src/Products/products.service';
@Module({
  imports:[TypeOrmModule.forFeature([Order,User,product])],
  controllers: [OrdersController],
  providers: [OrdersService,UsersService,ProductsService,{
    provide: APP_INTERCEPTOR,
    useClass: ClassSerializerInterceptor,
  }],
})
export class OrdersModule {}
