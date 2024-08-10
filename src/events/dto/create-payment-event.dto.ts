import { IsNotEmpty, IsString, IsNumber, IsPositive, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentEventDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'Gift message is required' })
    @IsString({ message: 'Gift message must be a string' })
    gift_message: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Gift amount is required' })
    @IsNumber({}, { message: 'Gift amount must be a number' })
    @IsPositive({ message: 'Gift amount must be a positive number' })
    gift_amount: number;

    @ApiProperty()
    @IsNotEmpty({ message: 'Country is required' })
    @IsString({ message: 'Country must be a string' })
    country: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'User ID is required' })
    @IsNumber({}, { message: 'User ID must be a number' })
    userId: number;

    @ApiProperty()
    @IsNotEmpty({ message: 'Number is required' })
    @IsString({ message: 'Number must be a string' })
    @Length(13, 19, { message: 'Number must be between 13 and 19 characters' })
    number: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Expiration month is required' })
    @IsNumber({}, { message: 'Expiration month must be a number' })
    @IsPositive({ message: 'Expiration month must be a positive number' })
    exp_month: number;

    @ApiProperty()
    @IsNotEmpty({ message: 'Expiration year is required' })
    @IsNumber({}, { message: 'Expiration year must be a number' })
    @IsPositive({ message: 'Expiration year must be a positive number' })
    exp_year: number;

    @ApiProperty()
    @IsNotEmpty({ message: 'CVC is required' })
    @IsString({ message: 'CVC must be a string' })
    @Length(3, 4, { message: 'CVC must be 3 or 4 characters' })
    cvc: string;
}
