import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { User } from 'src/users/entities/user.entity';
import { Event } from './entities/event.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
let stripe = require('stripe')(process.env.Stripe_Key); 
@Injectable()
export class EventsService {
  constructor(
    private readonly usersService: UsersService,
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  
  ) {}
  async create(createEventDto: CreateEventDto) {
    try {
      const { user_id, ...others } = createEventDto;

      // first check if th euser is listed in the stripe else return error
      const customer = await stripe.customers.list({
        email: others.reciever_email,
        limit: 1,
      });
       // Save the event and the user to persist the changes
      if(customer.data.length===0){
         throw new Error("Reciever email is not registerd on our system")
      }
      const user = await this.userRepository
        .createQueryBuilder('user')
        .where('user.id = :user_id', { user_id: user_id })
        .getOne();
        console.log(user)
      if (!user) {
        throw new Error('User not found');
      }

      const event = this.eventRepository.create({
        ...others,
        owner: user,
      });


     
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
