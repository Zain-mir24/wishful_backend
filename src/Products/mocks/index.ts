import { updateProductDTO } from '../dtos/UpdateProducts.dto';
import { product } from '../entities/product.entities';
  // Mock data
    const MockProductDetail: updateProductDTO = {
        id: 2,
        title: 'New Product title',
        description: 'This is the perfect description',
        price: 2343,
        categoryId: 1,
        image: ['232423.png'],
      };
  export   const mock_product_instance = Object.assign(new product(), MockProductDetail);


  export const expected_result={
    id: 2,
    title: 'New Product title',
    description: 'This is the perfect description',
    price: 2343,
    categoryId: 1,
    image: ['232423.png'],
  }