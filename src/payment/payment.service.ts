import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { TEvent } from 'src/interfaces/event.types';
import { Event as newEvent } from 'src/events/entities/event.entity';
import { Cron, SchedulerRegistry, Interval } from '@nestjs/schedule';
// import {Stripe as stripetype} from 'stripe'
@Injectable()
export class PaymentService {
  private my_stripe;
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<newEvent>,
    @InjectRepository(Payment)
    private readonly paymentRespository: Repository<Payment>,
  ) {
    this.my_stripe = require('stripe')(process.env.STRIPE_KEY);
  }

  // Id of the user creating the payment
  async create(id: number, customer_id: string, createPaymentDto: CreatePaymentDto) {
    try {
      console.log(createPaymentDto);

      const check_event: TEvent = await this.eventRepository
        .createQueryBuilder('event')
        .leftJoinAndSelect('event.owner', 'user')
        .where('event.eid = :eventId', { eventId: createPaymentDto.eventId })
        .getOne();

      console.log(check_event);

      if (!check_event) {
        throw new Error('Error finding this event');
      }

      // Current date and time
      const currentDate = new Date();

      const new_payment = await this.my_stripe.paymentMethods.create({
        type: 'card',
        card: { token: 'tok_visa' },
      });

      const paymentMethod = await this.my_stripe.paymentMethods.attach(
        new_payment.id,
        {
          customer: customer_id,
        },
      );

      const setupIntent = await this.my_stripe.setupIntents.create({
        customer: customer_id,
        payment_method: paymentMethod.id,
        automatic_payment_methods: {
          enabled: true,
          allow_redirects: 'never',
        },
      });
   

      const sendGift =
      await this.my_stripe.paymentIntents.create({
        amount: createPaymentDto.amount, // amount in cents
        currency: 'usd',
        payment_method: paymentMethod.id,
        payment_method_types: ['card'],
        customer:customer_id,
        automatic_payment_methods: {
          enabled: true,
          allow_redirects: 'never',
        },
        confirm: true, // Do not confirm the payment intent immediately
      });

      console.log("sendGift",sendGift);


      const create_payment = await this.paymentRespository.create({
        setup_intent: setupIntent.id,
        amount: createPaymentDto.amount,
        event: check_event,
        sender: id
      });

      console.log(create_payment);

      const save_payment = await this.paymentRespository.save(create_payment);

      if (currentDate === check_event['date']) {
        // make an instanct payment
        // return check_event
        //Immediate payment for this customer

        const createpayment = await this.my_stripe.paymentIntents.create({
          amount: createPaymentDto.amount, // amount in cents
          currency: 'usd',
          payment_method_types: ['card'],
          customer: 'customerId',
          confirm: true, // Do not confirm the payment intent immediately
        });
        return createpayment;

      }
      return { setupIntent, save_payment };
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
  @Interval(24 * 60 * 60 * 1000) // 24 hours in milliseconds
  async clearPayment() {
    try {
      const list_payment = await this.paymentRespository
        .createQueryBuilder('payment')
        .leftJoinAndSelect('payment.event', 'event')
        .getMany();
      console.log(list_payment);
      const paymentCleared = await Promise.all(
        list_payment.length &&
          list_payment.map(
            async (item: {
              pid: number;
              setup_intent: string;
              amount: number;
              event: newEvent;
            }) => {
              const current_date = new Date();

              const payment_data = new Date(item.event.date);
              current_date.setHours(0, 0, 0, 0);
              payment_data.setHours(0, 0, 0, 0);

              if (current_date.getTime() === payment_data.getTime()) {
                const retrieve_intent =
                  await this.my_stripe.setupIntents.retrieve(item.setup_intent);
                const retrieve_paymentMethod =
                  await this.my_stripe.paymentMethods.retrieve(
                    retrieve_intent.payment_method,
                  );
                const createpayment =
                  await this.my_stripe.paymentIntents.create({
                    amount: item.amount, // amount in cents
                    currency: 'usd',
                    payment_method: retrieve_paymentMethod.id,
                    customer: retrieve_paymentMethod.customer,
                    automatic_payment_methods: {
                      enabled: true,
                      allow_redirects: 'never',
                    },
                    confirm: true, // Do not confirm the payment intent immediately
                  });
                return { retrieve_paymentMethod, list_payment, createpayment };
              }
              return item;
            },
          ),
      );
      return paymentCleared;
    } catch (e) {
      console.log(e);
      return e;
    }
  }

  async findMyPayments(id:number){

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
