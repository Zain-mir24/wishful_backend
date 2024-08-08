import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { User } from 'src/users/entities/user.entity';
import { Event } from './entities/event.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { PaymentService } from 'src/payment/payment.service';
import { CreatePaymentEventDto } from './dto/create-payment-event.dto';
import { TEvent } from 'src/interfaces/event.types';
import { CreatePaymentDto } from 'src/payment/dto/create-payment.dto';
let stripe = require('stripe')(process.env.STRIPE_KEY); 
@Injectable()
export class EventsService {
  constructor(
    private readonly usersService: UsersService,
    private readonly paymentService:PaymentService,
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  
  ) {}
  async create(createEventDto: CreateEventDto) {
    try {
      const { userId, ...others } = createEventDto;
   
      const user = await this.userRepository
        .createQueryBuilder('user')
        .where('user.id = :userId', { userId: userId })
        .getOne();
        console.log(user)
      if (!user) {
        throw new Error('User not found');
      }

      const event = this.eventRepository.create({
        ...others,
        owner: user,
      });

      // Save the event and the user to persist the changes 
      const save_event = await this.eventRepository.save(event);
      return {
        status: 200,
        message: 'Event created',
        data: save_event,
      };
    } catch (e) {
      console.log(e)
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: e.message,
      }, HttpStatus.BAD_REQUEST, {
        cause: e
      });;
    }
  }


  async updateEvent() {
    try {

  
    } catch (e) {

    }
  }

  async findAll() {
    try{
      const allevent=await this.eventRepository.find();
      return allevent
    }catch(e){
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: e.message,
      }, HttpStatus.BAD_REQUEST, {
        cause: e.message
      });;
    }

  }

  async findByUser(id: number) {
    try{
      // first check if th euser is listed in the stripe else return error

      const events=await this.eventRepository
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.owner', 'owner')
      .where('owner.id = :id', { id: id })
      .getMany();

      return {message:"Success",data:events,status:200}
    }catch(e){
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: e.message,
      }, HttpStatus.BAD_REQUEST, {
        cause: e.message
      });;
    }
  }


  async confirmPayment(id: number, body:CreatePaymentEventDto) {
    try{
      const { userId,exp_month,exp_year,amount,cvc,number,country}=body;

      const paymentData:CreatePaymentDto = {
        eventId:id,
        exp_month,
        exp_year,
        amount,
        cvc,
        number,
        country
      };

      const getUserData = await this.usersService.findOne(userId);

      if (!getUserData) {

        throw new Error('User not found');
      
      }
      
      const customerStripeId = getUserData['customer_stripe_id'];

      const createPayment = await this.paymentService.create(userId, customerStripeId,paymentData);

      return createPayment;

    
    }
      catch(e){
        throw new HttpException({
          status: HttpStatus.BAD_REQUEST,
          error: e.message,
        }, HttpStatus.BAD_REQUEST, {
          cause: e
        });;
      }
  }
  async findOne(id: number): Promise<{
    message: string;
    data: TEvent;
    status: number;
  }> {
    try {

      // const customer = await stripe.customers.list({
      //   email: others.reciever_email,
      //   limit: 1,
      // });

      // // Save the event and the user to persist the changes
      // if (customer.data.length === 0) {
      //   throw new Error("Reciever email is not registerd on our system")
      // }
      const event = await this.eventRepository
        .createQueryBuilder('event')
        .where('event.eid = :id', { id: id })
        .getOne();

      const {amount_collected,...other} =event;
      if (!event) {
        throw new Error('Event not found');
      }
      return {
        message: "Success",
        data: other,
        status: 200,
      }

    } catch (e) {

      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: e.message,
      }, HttpStatus.BAD_REQUEST, {
        cause: e
      });

    }
  }

  update(id: number, updateEventDto: UpdateEventDto) {
    return `This action updates a #${id} event`;
  }

  remove(id: number) {
    return `This action removes a #${id} event`;
  }
}
