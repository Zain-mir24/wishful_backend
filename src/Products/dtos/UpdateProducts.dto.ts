import { ApiProperty, PartialType } from '@nestjs/swagger';
import { productDto } from './Products.dto';
export class updateProductDTO extends PartialType(productDto) {
  @ApiProperty()
  image?: string[];
  @ApiProperty()
  id?:number
}
