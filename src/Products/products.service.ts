import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { product } from './entities/product.entities';
import { productDto } from './dtos/Products.dto';
import { PageDto } from '../common/page.dto';
import { PageMetaDto } from '../common/page.meta.dto';
import { PageOptionsDto } from '../common/dtos';
import { Exception } from 'handlebars';
@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(product)
    private readonly productRepository: Repository<product>,
  ) {}

  //  creating product here and this is no
  async insertProduct(productData: productDto, images?: Object[]) {
    try {
      let imagesName = [];
      images.map((item: any) => {
        imagesName.push(item.filename);
      });

      const addProduct = await this.productRepository.save({
        ...productDto,
        image: imagesName,
      });
      return {
        Message: 'Product Created Successfully',
        data: addProduct,
      };
    } catch (e) {
      throw new Exception(e);
    }
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

  async findProductsByIds(ids): Promise<product[]> {
    const productIds = ids.map((id) => parseInt(id, 10));

    let getData = await this.productRepository
      .createQueryBuilder('product')
      .where('product.id IN (:...productIds)', { productIds })
      .getMany();

    return getData;
  }

  // now need to alter the update product function

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

  private findProduct(ProductId: string) {}
}
