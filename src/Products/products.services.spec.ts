import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { updateProductDTO } from './dtos/UpdateProducts.dto';
import { product } from './entities/product.entities';
import { ProductsService } from './products.service';
import { getRepositoryToken } from '@nestjs/typeorm';
jest.mock('../Products/products.service');
describe('Product Service', () => {
  let prodService: ProductsService;
  let repositoryMock: jest.Mocked<Repository<product>>;
  // This block will run before each unit test
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(product),
          useFactory: () => ({
            save: jest.fn(), // This is where you create a mock function
          }),
        },
      ],
    }).compile();

    prodService = module.get<ProductsService>(ProductsService);
    repositoryMock = module.get(getRepositoryToken(product));
  });
  it('Add products with image testCase', async () => {
    // Mock data
    const MockProductDetail: updateProductDTO = {
      id: 2,
      title: 'New Product title',
      description: 'This is the perfect description',
      price: 2343,
      categoryId: 1,
      image: '232423.png',
    };

    const mockProduct = Object.assign(new product(), MockProductDetail);

    const saveProduct = jest.fn().mockReturnValue(mockProduct);
    // Call the mock function directly
    const result = saveProduct();

    expect(result).toEqual({
      id: 2,
      title: 'New Product title',
      description: 'This is the perfect description',
      price: 2343,
      categoryId: 1,
      image: '232423.png',
    });
  });
});
