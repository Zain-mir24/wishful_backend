import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, Req, ClassSerializerInterceptor, UseInterceptors, Put } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Request } from 'express';
import { CreatePaymentEventDto } from   '../payment/dto/create-payment.dto';
import { Role } from 'src/common/role.enum';
import { Roles } from 'src/common/roles.decorator';
import { ApiResponse } from '@nestjs/swagger';
import { TEvent } from 'src/interfaces/event.types';
import { EventClass } from './classes/event.class';
import { CreateGiftDto } from 'src/payment/dto/create-payment-intent.dto';

@Controller('events')
@UseInterceptors(ClassSerializerInterceptor)

export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @HttpCode(201)
  @Roles(Role.User)

  create(@Body() createEventDto: CreateEventDto) {
    return this.eventsService.create(createEventDto);
  }

  @Get()
  findAll() {
    return this.eventsService.findAll();
  }

  // get all events of a user
  @Get('/myevents')
  @Roles(Role.User)
  @HttpCode(200)
  findByUser(@Req() request: Request) {
    const user = request['user'];
      console.log("user",user);
      const {userId,...other}=user
    return this.eventsService.findByUser(userId);
  }


  @Put('createPaymentIntent/:id')
  @Roles(Role.User)
  @HttpCode(201)
  async createPaymentIntent(@Param('id') id: number, @Req() request: Request,@Body () body:CreateGiftDto) {
    
    return this.eventsService.createPaymentIntent(id,body);
  }

  @Get(':id')
  @Roles(Role.User)
  @HttpCode(200)
  @ApiResponse({
    description: "Success",
    type: EventClass,
    status: 200
  })
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventsService.update(+id, updateEventDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventsService.remove(+id);
  }
}
