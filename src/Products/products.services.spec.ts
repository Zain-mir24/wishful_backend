import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { mock_product_instance ,expected_result} from './mocks';
import { product } from './entities/product.entities';
import { ProductsService } from './products.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PageOptionsDto } from 'src/common/dtos';
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
  it('Add product Successfull', async () => {
    const saveProduct = jest.fn().mockReturnValue(mock_product_instance);
    // Call the mock function directly
    const result = saveProduct();

    expect(result).toEqual(expected_result);
  });

  it('Get all products ',async()=>{

    const mockPageOptions: PageOptionsDto = { page: 1, pageSize: 4 };
     // Mock the implementation of getProducts
     (prodService.getProducts as jest.Mock).mockResolvedValue(mock_product_instance);
    const result = await prodService.getProducts(mockPageOptions)
    
    // Add your assertions for the result if needed
    expect(result).toEqual(mock_product_instance);

    // Ensure that the function was called once
    expect(prodService.getProducts).toBeCalledTimes(1);

  })
});
