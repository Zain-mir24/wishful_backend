import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { User } from 'src/users/entities/user.entity';
import { Event } from './entities/event.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { PaymentService } from 'src/payment/payment.service';
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

      // first check if th euser is listed in the stripe else return error
      // const customer = await stripe.customers.list({
      //   email: others.reciever_email,
      //   limit: 1,
      // });
      //     // Save the event and the user to persist the changes
      //     if(customer.data.length===0){
      //       throw new Error("Reciever email is not registerd on our system")
      //    }
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

  findOne(id: number) {
    return `This action returns a #${id} event`;
  }

  update(id: number, updateEventDto: UpdateEventDto) {
    return `This action updates a #${id} event`;
  }

  remove(id: number) {
    return `This action removes a #${id} event`;
  }
}
