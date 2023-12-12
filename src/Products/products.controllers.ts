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
} from '@nestjs/common';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { Roles } from 'src/common/roles.decorator';
import { Role } from 'src/common/role.enum';
import { ProductsService } from './products.service';
import { productDto } from './dtos/Products.dto';
import { ApiOkResponse } from '@nestjs/swagger';
import { PageOptionsDto } from 'src/common/dtos';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
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
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './assets',
        filename: (req, file, cb) => {
          const fileNameSplit = file.originalname.split('.');
          const fileTxt = fileNameSplit[fileNameSplit.length - 1];
          cb(null, `${Date.now()}.${fileTxt}`);
        },
      }),
    }),
  )
  addProduct(
    @Body() product: productDto,
    @UploadedFile() image: Express.Multer.File,
  ): any {
    try {
      console.log(image, 'IMAGE');
      const generatedId = this.productService.insertProduct(product,image?.filename);
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
