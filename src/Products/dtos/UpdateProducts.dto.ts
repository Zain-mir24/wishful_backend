import { ApiProperty, PartialType } from '@nestjs/swagger';
import { productDto } from './Products.dto';
export class updateProductDTO extends PartialType(productDto) {
  @ApiProperty()
  images?: object[];
  @ApiProperty()
  id?:number
  @ApiProperty()
  previous_images?:string[]
}
