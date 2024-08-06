import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Event } from 'src/events/entities/event.entity';
import { PaymentService } from 'src/payment/payment.service';
import { Payment } from 'src/payment/entities/payment.entity';
@Module({
  imports:[TypeOrmModule.forFeature([User,Event,Payment])],
  controllers: [UsersController],
  providers: [UsersService,PaymentService],
})
export class UsersModule {}
