import { ApiProperty } from '@nestjs/swagger';
export class CreateEventDto {
    @ApiProperty()
    readonly date:string;

    @ApiProperty()
    readonly event_name:string;

    @ApiProperty()
    readonly image:string;

    @ApiProperty()
    readonly event_description:string;

    @ApiProperty()
    readonly gift_message:string;

    @ApiProperty()
    readonly gift_amount:number;

    @ApiProperty()
    readonly gift_from:string;

    @ApiProperty()
    readonly country:string;

    @ApiProperty()
    readonly reciever_email:string;

    @ApiProperty()
    readonly event_url:string;

    @ApiProperty()
    user_id: number;

        
}
