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
    private readonly paymentRepository: Repository<Payment>,
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
        throw new Error("User not verified on stripe")   
      }
      stripeAccount=event.owner.customerStripeAccountId;

    
      const paymentIntent = await this.my_stripe.paymentIntents.retrieve(createPaymentDto.paymentIntentId);
      console.log("paymentIntent",paymentIntent);
      
      const transferAmount = others.gift_amount * 0.98; // Keeping 2% as your fee

      const transfer = await this.my_stripe.transfers.create({
        amount: Math.round(transferAmount * 100), // in the smallest currency unit (e.g., cents)
        currency: 'aud',
        destination: stripeAccount, // connected account ID
        source_transaction: paymentIntent.latest_charge, // the original charge/payment intent
      });

      console.log("Transferred the payment",transfer);
      const payment = this.paymentRepository.create({
        gift_amount: others.gift_amount,
          event: event,
          sender: others.userId,
          gift_message: others.gift_message,
          country: others.country,
      });   

      // // Save the event and the user to persist the changes
       await this.paymentRepository.save(payment);
      
      
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
        amount:Math.round(gift_amount * 100), // amount in cents
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
  // @Interval(24 * 60 * 60 * 1000) // 24 hours in milliseconds
  async clearPayment() {
    try {
      const list_payment = await this.paymentRepository
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

  /**
   * Finds all payments made by the user with the given userId
   * @param userId the id of the user to find payments for
   * @returns an array of payments made by the user
   */
  async findMyPayments(userId: number) {
    try {
      const payments = await this.paymentRepository
      .createQueryBuilder('payment')
      .innerJoinAndSelect('payment.event', 'event')
      .where('event.userId = :userId', { userId})
      .getMany();

      // Sum all the gift_amount values
      const totalGiftAmount = payments.reduce((sum, payment) => sum + payment.gift_amount, 0);
      return {
        message: 'total gift amount',
        data: totalGiftAmount,
        status: 200,
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
