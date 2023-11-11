import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { product } from './entities/product.entities';
@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(product)
    private readonly productRepository: Repository<product>,
  ) {}

  async insertProduct(title: string, description: string, price: number) {
    let newProduct = new product();

    (newProduct.title = title), (newProduct.description = description);
    newProduct.price = price;

    const addProduct = await this.productRepository.save(newProduct);
    return addProduct;
  }
  async getProducts() {
    const getProduct = await this.productRepository.find();
    return getProduct;
  }
  getProductById(ProductId: string) {
    const product = this.findProduct(ProductId)[0];
    return { ...product };
  }
  updateProduct(
    ProductId: string,
    Payload: {
      title: string;
      description: string;
      price: number;
    },
  ) {
    let { title, description, price } = Payload;
    let product;
    let updatedProduct = { ...product };
    if (title) {
      updatedProduct.title = title;
    }
    if (description) {
      updatedProduct.description = description;
    }
    if (price) {
      updatedProduct.price = price;
    }
    // this.products[index] = updatedProduct;
    return updatedProduct;
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
