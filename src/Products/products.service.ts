import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { product } from './entities/product.entities';
import { productDto } from './dtos/Products.dto';
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
  async getProducts() {
    const getProduct = await this.productRepository.find();
    return getProduct;
  }
  getProductById(ProductId: string) {
    const product = this.findProduct(ProductId)[0];
    return { ...product };
  }
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
    // const productIndex = this.products.findIndex(
    //   (prod) => prod.id === ProductId,
    // );
    // const product = this.products[productIndex];
    // if (!product) {
    //   throw new NotFoundException();
    // }
    // return [product, productIndex];
  }
}
