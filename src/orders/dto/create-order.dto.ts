// import {IsString,IsNotString} from 'class-validator'

export class CreateOrderDto {
    readonly title:string;
    readonly address:string;
    readonly status:string;
    readonly price:number;
    readonly productId:number;
}
