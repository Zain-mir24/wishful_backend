import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { User } from 'src/users/entities/user.entity';
import { Event } from './entities/event.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { Payment } from 'src/payment/entities/payment.entity';
import { PaymentService } from 'src/payment/payment.service';
@Module({
  imports:[TypeOrmModule.forFeature([User,Event,Payment])],
  controllers: [EventsController],
  providers: [EventsService,UsersService,PaymentService],
})
export class EventsModule {}
