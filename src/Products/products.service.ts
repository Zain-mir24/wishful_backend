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
    const [product, index] = this.findProduct(ProductId);
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
    this.products[index] = updatedProduct;
    return updatedProduct
  }

  private findProduct(ProductId: string): [Product, number] {
    const productIndex = this.products.findIndex(
      (prod) => prod.id === ProductId,
    );
    const product = this.products[productIndex];
    if (!product) {
      throw new NotFoundException();
    }
    return [product, productIndex];
  }
}
