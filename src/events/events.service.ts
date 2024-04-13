import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { User } from 'src/users/entities/user.entity';
import { Event } from './entities/event.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async create(createEventDto: CreateEventDto) {
    try {
      const { user_id, ...others } = createEventDto;
      const user = await this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.events', 'event')
        .where('user.id = :userId', { user_id })
        .getOne();
        console.log(user)
      if (!user) {
        throw new Error('User not found');
      }

      const event = this.eventRepository.create({
        ...others,
        owner: user,
      });

      // Add the newly created event to the user's events
      user.events.push(event);

      // Save the event and the user to persist the changes
      const save_event = await this.eventRepository.save(event);
      await this.userRepository.save(user);
      return {
        status: 200,
        message: 'Event created',
        data: save_event,
      };
    } catch (e) {
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: e,
      }, HttpStatus.BAD_REQUEST, {
        cause: e
      });;
    }
  }

  findAll() {
    return `This action returns all events`;
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
