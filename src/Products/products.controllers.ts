import { Controller, Post, Body,Get } from '@nestjs/common';
import { ProductsService } from './products.service';
@Controller('Products')
export class ProductController {
  constructor(private readonly productService: ProductsService) {}
  @Post()
  addProduct(
    @Body('title') productTitle: string,
    @Body('description') descriptionTitle: string,
    @Body('Price') priceTitle: number,
  ): any {
    const generatedId= this.productService.insertProduct(productTitle,descriptionTitle,priceTitle);
    return {id:generatedId}
  }

  @Get()
  getProduct(){
    const data= this.productService.getProducts()
    return data
  }
}
