// import {IsString,IsNotString} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
    @ApiProperty()
    readonly address:string;
    @ApiProperty()
    readonly status:string;
    @ApiProperty()
    readonly price:number;
    @ApiProperty()
    readonly productId:number[];
}
