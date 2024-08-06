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
    readonly event_url:string;

    @ApiProperty()
    userId: number;
        
}
