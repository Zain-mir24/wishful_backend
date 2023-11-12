import { ApiProperty } from '@nestjs/swagger';

export class productDto{
    @ApiProperty()
    title: string;
    @ApiProperty()
    description: string;
    @ApiProperty()
    price: number;
    @ApiProperty()
    categoryId: number
}