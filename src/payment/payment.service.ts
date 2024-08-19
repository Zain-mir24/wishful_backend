import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePaymentEventDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { TEvent } from 'src/interfaces/event.types';
import { Event as newEvent } from 'src/events/entities/event.entity';
import { UsersService } from 'src/users/users.service';
import { Cron, SchedulerRegistry, Interval } from '@nestjs/schedule';
// import {Stripe as stripetype} from 'stripe'
@Injectable()
export class PaymentService {
  private my_stripe;
  constructor(
    private readonly usersService: UsersService,
    @InjectRepository(Event)
    private readonly eventRepository: Repository<newEvent>,
    @InjectRepository(Payment)
    private readonly paymentRespository: Repository<Payment>,
  ) {
    this.my_stripe = require('stripe')(process.env.STRIPE_KEY);
  }


  async create( createPaymentDto: CreatePaymentEventDto) {
    try {
      let stripeAccount;
      const { eventId, ...others } = createPaymentDto;
      const event = await this.eventRepository
        .createQueryBuilder('event')
        .leftJoinAndSelect('event.owner', 'user')
        .where('event.eid = :eventId', { eventId: eventId })
        .getOne();
      if (!event) {
        throw new Error('Error finding this event');
      }
      if(!event.owner.customerStripeAccountId){
        const account = await this.my_stripe.accounts.create({
          type: 'express', // or 'standard' based on your needs
          country: 'AU',
          email: event.owner.email
        });
       
        stripeAccount=account.id
       await this.usersService.update(event.owner.id,  {customerStripeAccountId:account.id});
       
      }else{
        stripeAccount=event.owner.customerStripeAccountId;
      }
      const paymentIntent = await this.my_stripe.paymentIntents.retrieve(createPaymentDto.paymentIntentId);
      console.log("paymentIntent",paymentIntent);
      
      const transferAmount = others.gift_amount * 0.98; // Keeping 2% as your fee


      const transfer = await this.my_stripe.transfers.create({
        amount: Math.round(transferAmount), // in the smallest currency unit (e.g., cents)
        currency: 'usd',
        destination: stripeAccount, // connected account ID
        source_transaction: paymentIntent.latest_charge, // the original charge/payment intent
      });

      console.log("Transferred the payment",transfer);

      return transfer

      // const payment = this.paymentRespository.create({
      //   gift_amount: others.gift_amount,
      //     event: event,
      //     sender: others.userId,
      //     gift_message: others.gift_message,
      //     country: others.country,
      // });   

      // // Save the event and the user to persist the changes
      // const save_payment = await this.paymentRespository.save(payment);
      
      return {
        status: 200,
        message: 'Payment created',
        data: event,
      };  

    } catch (e) {
      console.log("ERROR",e);
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: e.message,
      }, HttpStatus.BAD_REQUEST, {
        cause: e
      });
    }
  }

  /**
   * Creates a payment intent for a customer to make a gift payment.
   *
   * @param {string} customer_id - The ID of the customer making the payment.
   * @param {number} eventId - The ID of the event for which the payment is being made.
   * @param {number} gift_amount - The amount of the gift payment in cents.
   * @return {Promise<{ message: string, status: number, data: { id: string, client_secret: string, customer: string } }>} 
   *   A promise that resolves with an object containing a success message, a status code, 
   *   and the payment intent data, including the ID, client secret, and customer ID.
   */
  async createPaymentIntent( customer_id: string, eventId:number,gift_amount:number)
    : Promise<{
      message: string, status: number, data: {
        id: string
        client_secret: string,
        customer: string
      }
    }>
   {
    try {

      const check_event: TEvent = await this.eventRepository
        .createQueryBuilder('event')
        .leftJoinAndSelect('event.owner', 'user')
        .where('event.eid = :eventId', { eventId: eventId})
        .getOne();

      console.log(check_event);

      if (!check_event) {
        throw new Error('Error finding this event');
      }
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
      console.log("paymentMethod",paymentMethod);
      const sendGift =
      await this.my_stripe.paymentIntents.create({
        amount: gift_amount, // amount in cents
        currency: 'AUD',
        customer:customer_id,
        payment_method: paymentMethod.id,
        confirm: true, // Do not confirm the payment intent immediately, 
        automatic_payment_methods: {
          enabled: true,
          allow_redirects: 'never',
        }      
      });

      console.log("sendGift",sendGift);
      const { client_secret,id,customer } = sendGift;
      const clientSecret={
        id,
        client_secret,
        customer
      }
      
      return {
        message: 'Payment created',
        data: clientSecret,
        status: 200,
      };
//       const paymentMethodInfo = await this.my_stripe.paymentMethods.retrieve(paymentMethod.id);
// console.log(paymentMethodInfo);
//       if (paymentIntent.status === 'succeeded') {
//         console.log('Payment succeeded:', paymentIntent);
//       } else {
//         console.error('Payment failed:', paymentIntent.status);
//       }
     

 // // Current date and time
      // const currentDate = new Date();

   

      // const setupIntent = await this.my_stripe.setupIntents.create({
      //   customer: customer_id,
      //   payment_method: paymentMethod.id,
      //   automatic_payment_methods: {
      //     enabled: true,
      //     allow_redirects: 'never',
      //   },
      // });
   

      // const create_payment = await this.paymentRespository.create({
      //   setup_intent: setupIntent.id,
      //   amount: createPaymentDto.gift_amount,
      //   event: check_event,
      //   sender: id,
      //   gift_message: createPaymentDto.gift_message,
      //   country: createPaymentDto.country,
      // });

      // console.log(create_payment);

      // const save_payment = await this.paymentRespository.save(create_payment);

      // if (currentDate === check_event['date']) {
      //   // make an instanct payment
      //   // return check_event
      //   //Immediate payment for this customer

      //   const createpayment = await this.my_stripe.paymentIntents.create({
      //     amount: createPaymentDto.gift_amount, // amount in cents
      //     currency: 'usd',
      //     payment_method_types: ['card'],
      //     customer: 'customerId',
      //     confirm: true, // Do not confirm the payment intent immediately
      //   });
      //   return createpayment;

      // }
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
              gift_amount: number;
              event: newEvent;
            }) => {
              const current_date = new Date();

              const payment_data = new Date(item.event.date);
              current_date.setHours(0, 0, 0, 0);
              payment_data.setHours(0, 0, 0, 0);

              // if (current_date.getTime() === payment_data.getTime()) {
              //   const retrieve_intent =
              //     await this.my_stripe.setupIntents.retrieve(item.setup_intent);
              //   const retrieve_paymentMethod =
              //     await this.my_stripe.paymentMethods.retrieve(
              //       retrieve_intent.payment_method,
              //     );
              //   const createpayment =
              //     await this.my_stripe.paymentIntents.create({
              //       amount: item.amount, // amount in cents
              //       currency: 'usd',
              //       payment_method: retrieve_paymentMethod.id,
              //       customer: retrieve_paymentMethod.customer,
              //       automatic_payment_methods: {
              //         enabled: true,
              //         allow_redirects: 'never',
              //       },
              //       confirm: true, // Do not confirm the payment intent immediately
              //     });
              //   return { retrieve_paymentMethod, list_payment, createpayment };
              // }
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
