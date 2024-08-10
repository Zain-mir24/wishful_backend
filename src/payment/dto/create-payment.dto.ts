import { ApiProperty } from '@nestjs/swagger';

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
  gift_amount:number;
  @ApiProperty()
  country:string;
  @ApiProperty()
  gift_message:string;
}
