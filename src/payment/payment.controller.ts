import { Controller, Get, Post, Body, Patch, Param, Delete ,
  Req,
  HttpCode,

} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentEventDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Request } from 'express';
import { Roles } from 'src/common/roles.decorator';
import { Role } from 'src/common/role.enum';
import { ApiResponse } from '@nestjs/swagger';
import { EventClass } from './classes/payment-create.class';
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  @Roles(Role.User)
  @HttpCode(200)
  @ApiResponse({
    description: "Success",
    type: EventClass,
    status: 200
  })  
  create(@Body() createPayment: CreatePaymentEventDto,@Req() req: Request) {
   
    return this.paymentService.create(createPayment);
  }

  @Post('clearPayment')
  clearPayment() {
    return this.paymentService.clearPayment();
  }

  @Get()
  findAll() {
    return this.paymentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.paymentService.update(+id, updatePaymentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentService.remove(+id);
  }
}
