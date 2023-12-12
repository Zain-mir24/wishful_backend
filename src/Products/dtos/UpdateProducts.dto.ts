import { ApiProperty, PartialType } from '@nestjs/swagger';
import { productDto } from './Products.dto';
export class updateProductDTO extends PartialType(productDto) {
  image?: string;
  id?:number
}
