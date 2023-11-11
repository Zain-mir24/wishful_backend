import {
  Controller,
  Post,
  Body,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  UseGuards
} from '@nestjs/common';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { Roles } from 'src/common/roles.decorator';
import { Role } from 'src/common/role.enum';
import { ProductsService } from './products.service';
@Controller('Products')
@UseGuards(RolesGuard)
export class ProductController {
  constructor(private readonly productService: ProductsService) {}
  @Post()
  @Roles(Role.Admin)
  addProduct(
    @Body('title') productTitle: string,
    @Body('description') descriptionTitle: string,
    @Body('Price') priceTitle: number,
  ): any {
    try {
      const generatedId = this.productService.insertProduct(
        productTitle,
        descriptionTitle,
        priceTitle,
      );
      return { id: generatedId };
    } catch (e) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'This is a custom message',
        },
        HttpStatus.FORBIDDEN,
        {
          cause: e,
        },
      );
    }
  }

  @Get()
  @Roles(Role.Admin,Role.User)
   getProduct() {
    const data = this.productService.getProducts();
    return data;
  }

  @Get(':id')
  getProductById(@Param('id') prodId: string) {
    const data = this.productService.getProductById(prodId);
    return data;
  }

  @Patch(':id')
  updateProduct(
    @Param('id') prodId: string,
    @Body('title') title: string,
    @Body('description') description: string,
    @Body('Price') price: number,
  ) {
    let payload = {
      title,
      description,
      price,
    };
    const data = this.productService.updateProduct(prodId, payload);
    return data;
  }
}
