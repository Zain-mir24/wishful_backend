import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { TEvent } from 'src/interfaces/event.types';
import {  Event as newEvent} from 'src/events/entities/event.entity';
// import {Stripe as stripetype} from 'stripe'
@Injectable()
export class PaymentService {
  private my_stripe;
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<newEvent>,
    @InjectRepository(Event)
    private readonly paymentRespository: Repository<Payment>,
  ) {
    this.my_stripe = require('stripe')(process.env.STRIPE_KEY);
  }
  async create(createPaymentDto: CreatePaymentDto) {
    try {
      console.log(createPaymentDto);
      const check_event:TEvent = await this.eventRepository
        .createQueryBuilder('event')
        .leftJoinAndSelect('event.owner', 'user')
        .where('event.eid = :event_id', { event_id: createPaymentDto.event_id })
        .getOne();
      // return check_event
      console.log(check_event)
      if (!check_event) {
        throw new Error('Error finding this event');
      }
      const customer_id=check_event.owner.customer_stripe_id;

      // Current date and time
      const currentDate = new Date();
      const new_payment = await this.my_stripe.paymentMethods.create({
   
        type: 'card',
        card: {token: "tok_visa"}
      });

      if (currentDate < check_event['date']) {
        // create intent if the event is for future.

        const setupIntent = await this.my_stripe.setupIntents.create({
          customer:customer_id,
          payment_method_types: ['card'],
          payment_method: new_payment.id,
        });

      

    
        const create_payment= await this.paymentRespository.create({
          setup_intent: setupIntent.id,
          amount: createPaymentDto.amount,
          event: check_event
        })

        console.log( create_payment)
        const save_payment= await this.paymentRespository.save(create_payment);

        return {setupIntent,save_payment};
      } else {
        // make an instanct payment

        //Immediate payment for this customer

        const createpayment = await this.my_stripe.paymentIntents.create({
          amount: createPaymentDto.amount, // amount in cents
          currency: 'usd',
          payment_method_types: ['card'],
          // customer: 'customerId',
          confirm: true, // Do not confirm the payment intent immediately
        });
        return createpayment;

        // const create_payment=await this.paymentRespository.cr
      }
    } catch (e) {
      console.log(e);
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: e.message,
        },
        HttpStatus.BAD_REQUEST,
        {
          cause: e,
        },
      );
    }
  }

  findAll() {
    return `This action returns all payment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} payment`;
  }

  update(id: number, updatePaymentDto: UpdatePaymentDto) {
    return `This action updates a #${id} payment`;
  }

  remove(id: number) {
    return `This action removes a #${id} payment`;
  }
}
