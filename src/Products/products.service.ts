import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from './product.model';

@Injectable()
export class ProductsService {
  private products: Product[] = [];
  insertProduct(title: string, description: string, price: number) {
    let prodId = Math.random().toString();
    const newProduct = new Product(prodId, title, description, price);
    this.products.push(newProduct);

    return this.products;
  }
  getProducts() {
    return [...this.products];
  }
  getProductById(ProductId: string) {
    const product = this.products.find((prod) => prod.id === ProductId);
    if (!product) {
      throw new NotFoundException();
    }
    return { ...product };
  }
}
