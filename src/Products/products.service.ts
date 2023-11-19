import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { product } from './entities/product.entities';
import { productDto } from './dtos/Products.dto';
import { PageDto } from 'src/common/page.dto';
import { PageMetaDto } from 'src/common/page.meta.dto';
import { PageOptionsDto } from 'src/common/dtos';
@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(product)
    private readonly productRepository: Repository<product>,
  ) {}

  async insertProduct(productData: productDto) {
    let newProduct = new product();

    (newProduct.title = productData.title),
      (newProduct.description = productData.description);
    newProduct.price = productData.price;
    newProduct.categoryId = productData.categoryId;

    const addProduct = await this.productRepository.save(newProduct);
    return {
      Message: 'Product Created Successfully',
      data: addProduct,
    };
  }
  
  async getProducts(
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<productDto>> {
    const queryBuilder = this.productRepository.createQueryBuilder('product');

    if (pageOptionsDto.search) {
      queryBuilder.where('product.title ILIKE :searchTerm', {
        searchTerm: `%${pageOptionsDto.search}%`,
      });
    }

    queryBuilder
      .orderBy('product.id', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.pageSize);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  async getProductById(ProductId: number) {
    const getProduct = await this.productRepository.findOne({
      where: {
        id: ProductId,
      },
    });
    return { getProduct };
  }

  async getProductsByCategory() {}

  async updateProduct(id: string, product: productDto) {
    try {
      const update_product = await this.productRepository.update(id, product);

      return {
        Message: 'Updated Product Succesfully',
        Data: update_product,
      };
    } catch (e) {
      return e;
    }
  }

  private findProduct(ProductId: string) {

  }
}
