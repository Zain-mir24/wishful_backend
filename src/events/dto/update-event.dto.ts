import { PartialType,ApiProperty } from '@nestjs/swagger';
import { CreateEventDto } from './create-event.dto';
import { isNotEmpty, IsNotEmpty } from 'class-validator';

export class UpdateEventDto extends PartialType(CreateEventDto) {
  
}
