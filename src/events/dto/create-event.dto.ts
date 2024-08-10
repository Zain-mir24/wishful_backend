import { IsNotEmpty, IsString, IsUrl, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEventDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Date is required' })
  @IsString({ message: 'Date must be a string' })
  readonly date: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Event name is required' })
  @IsString({ message: 'Event name must be a string' })
  readonly event_name: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Image is required' })
  @IsString({ message: 'Image must be a string' })
  readonly image: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Event description is required' })
  @IsString({ message: 'Event description must be a string' })
  readonly event_description: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Event URL is required' })
  @IsUrl({}, { message: 'Event URL must be a valid URL' })
  readonly event_url: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'User ID is required' })
  @IsNumber({}, { message: 'User ID must be a number' })
  userId: number;
}
