import { ApiProperty } from '@nestjs/swagger';
import { CreatePaymentEventDto } from 'src/events/dto/create-payment-event.dto';

export class CreatePaymentDto {
  @ApiProperty()
  eventId: number;
  @ApiProperty()
  number: string;
  @ApiProperty()
  exp_month: number;
  @ApiProperty()
  exp_year: number;
  @ApiProperty()
  cvc: string;
  @ApiProperty()
  amount:number;
}
