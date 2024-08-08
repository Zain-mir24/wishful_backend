import { ApiProperty} from '@nestjs/swagger';
export class CreatePaymentEventDto {
    @ApiProperty()
    gift_message: string;

    @ApiProperty()
    gift_amount: number;

    @ApiProperty()
    country: string;

    @ApiProperty()
    userId: number;

    @ApiProperty()
    number: string;

    @ApiProperty()
    exp_month: number;

    @ApiProperty()
    exp_year: number;

    @ApiProperty()
    cvc: string;

    @ApiProperty()
    amount: number;
}
