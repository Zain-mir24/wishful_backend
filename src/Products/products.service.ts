import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { product } from './entities/product.entities';
import { productDto } from './dtos/Products.dto';
import { PageDto } from '../common/page.dto';
import { PageMetaDto } from '../common/page.meta.dto';
import { PageOptionsDto } from '../common/dtos';
import { Exception } from 'handlebars';
import { updateProductDTO } from './dtos/UpdateProducts.dto';
import { FileInformation } from './types';
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
  console.log(pageOptionsDto)
  const skip=(pageOptionsDto.page - 1) * pageOptionsDto.pageSize;
    const queryBuilder = this.productRepository.createQueryBuilder('product');

    if (pageOptionsDto.search) {
      queryBuilder.where('product.title ILIKE :searchTerm', {
        searchTerm: `%${pageOptionsDto.search}%`,
      });
    }
    console.log(skip)

    queryBuilder
      .orderBy('product.id', pageOptionsDto.order)
      .skip(skip)
      .take(pageOptionsDto.pageSize)

    const itemCount = await queryBuilder.getCount();
    // console.log(itemCount)
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
  // Furst check that if i already have the incoming filename then donot add it but if its all new then add it into image array in db or creeate new array

  async updateProduct(
    id: number,
    product: updateProductDTO,
    images: FileInformation[],
  ) {
    try {
      let new_product = product;
      let latestImages = [];
      const existingProduct = await this.productRepository.findOneBy({ id });
      if (!existingProduct) {
        return {
          Message: 'Product not found',
          Data: null,
        };
      }
      if (product.previous_images && product.previous_images.length > 0) {
        product.previous_images.map((item) => {
          latestImages.push(item);
        });
      }
      // Ensure the images property exists on the existing product
      existingProduct.image = existingProduct.image || [];
      for (const newImage of images) {
        latestImages.push(newImage.filename);
      }
      let { previous_images, ...other } = product;

      new_product = other;

      const update_product = await this.productRepository.update(id, {
        ...new_product,
        image: latestImages,
      });
      
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
