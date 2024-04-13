import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { User } from 'src/users/entities/user.entity';
import { Event } from './entities/event.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports:[TypeOrmModule.forFeature([User,Event])],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}
