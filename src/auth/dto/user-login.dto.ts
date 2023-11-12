import { ApiProperty } from '@nestjs/swagger';

export class userDto{
    @ApiProperty()
    email:string;
    @ApiProperty()
    password:string;
}