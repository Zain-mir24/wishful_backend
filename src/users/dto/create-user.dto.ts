import { ApiProperty } from '@nestjs/swagger';
export class CreateUserDto {
    @ApiProperty()
   readonly username:string;
   @ApiProperty()
    readonly password:string;
    @ApiProperty()
    readonly email:string;
    @ApiProperty()
    readonly phone_no:string;
    @ApiProperty()
    readonly verified:boolean;
    @ApiProperty()
    readonly accessToken?:string;
    @ApiProperty()
    readonly refreshToken?:string;
    @ApiProperty()
    readonly role:string;
}
