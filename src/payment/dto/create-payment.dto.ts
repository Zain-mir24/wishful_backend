import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentDto {
  @ApiProperty()
  event_id: number;
  @ApiProperty()
  number: string;
  @ApiProperty()
  exp_month: number;
  @ApiProperty()
  exp_year: number;
  @ApiProperty()
  cvc: string;
  @ApiProperty()
  amount:number
}
