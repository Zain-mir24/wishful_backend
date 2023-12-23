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
  Query,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { Roles } from 'src/common/roles.decorator';
import { Role } from 'src/common/role.enum';
import { ProductsService } from './products.service';
import { productDto } from './dtos/Products.dto';
import { ApiOkResponse } from '@nestjs/swagger';
import { PageOptionsDto } from 'src/common/dtos';
import { PageDto } from '../common/page.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
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
  @UseInterceptors(
    FilesInterceptor('images', 20, {
      storage: diskStorage({
        destination: './assets',
        filename: (req, file, callback) => {
          console.log(file);
          const name = file.originalname.split('.')[0];
          const fileExtName = extname(file.originalname);
          const randomName = Array(4)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          callback(null, `${name}-${randomName}${fileExtName}`);
        },
      }),
    }),
  )
  addProduct(
    @Body() product: productDto,
    @UploadedFiles() images: Array<Express.Multer.File>,
  ): any {
    try {
      const generatedId = this.productService.insertProduct(product, images);
      return generatedId;
    } catch (e) {
      console.log(e, 'ERRRROR');
      return e;
    }
  }
  @ApiOkResponse({
    type: PageDto<productDto>,
  })
  @Get()
  @Roles(Role.Admin, Role.User)
  getProduct(@Query() pageOptionsDto: PageOptionsDto) {
    const data = this.productService.getProducts(pageOptionsDto);
    return data;
  }

  @Get(':id')
  @Roles(Role.Admin, Role.User)
  getProductById(@Param('id') prodId: number) {
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
