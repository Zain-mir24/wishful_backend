export class CreateUserDto {
   readonly username:string;
    readonly password:string;
    readonly email:string;
    readonly phone_no:string;
    readonly verified:boolean;
    readonly accessToken?:string;
    readonly refreshToken?:string;
}
