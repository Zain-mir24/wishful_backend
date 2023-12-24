import { updateProductDTO } from '../dtos/UpdateProducts.dto';
import { product } from '../entities/product.entities';
  // Mock data
    const MockProductDetail: updateProductDTO = {
        id: 2,
        title: 'New Product title',
        description: 'This is the perfect description',
        price: 2343,
        categoryId: 1,
        images: [{
          fieldname: 'images',
          originalname: 'Screenshot 2023-09-09 145629.png',
          encoding: '7bit',
          mimetype: 'image/png',
          destination: './assets',
          filename: 'Screenshot 2023-09-09 145629-8d37.png',
          path: 'assets\\Screenshot 2023-09-09 145629-8d37.png',
          size: 167601,
        }],
        previous_images:['232423.png']
      };
  export   const mock_product_instance = Object.assign(new product(), MockProductDetail);


  export const expected_result={
    id: 2,
    title: 'New Product title',
    description: 'This is the perfect description',
    price: 2343,
    categoryId: 1,
    image: ['232423.png','Screenshot 2023-09-09 145629-8d37.png'],
  }