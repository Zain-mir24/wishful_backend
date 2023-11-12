import {
  Controller,
  Post,
  Body,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { Roles } from 'src/common/roles.decorator';
import { Role } from 'src/common/role.enum';
import { ProductsService } from './products.service';
import { productDto } from './dtos/Products.dto';
import { ApiOkResponse } from '@nestjs/swagger';
@Controller('Products')
@UseGuards(RolesGuard)
export class ProductController {
  constructor(private readonly productService: ProductsService) {}
  @ApiOkResponse({
    description: 'Product Created Successfully',
    type: productDto,
  })
  @Post()
  @Roles(Role.Admin)
  addProduct(@Body() product: productDto): any {
    try {
      const generatedId = this.productService.insertProduct(product);
      return generatedId;
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
  @Roles(Role.Admin, Role.User)
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
  @Roles(Role.Admin)
  updateProduct(@Param('id') prodId: string, @Body() product: productDto) {
    const data = this.productService.updateProduct(prodId, product);
    return data;
  }
}
