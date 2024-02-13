import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { ProductsService } from '../Products/products.service';
import { UsersService } from '../users/users.service';
import { Order } from './entities/order.entity';
import { product } from '../Products/entities/product.entities';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
jest.mock('../users/users.service');
describe('OrdersService', () => {
  let service: OrdersService;
  let usersService: UsersService;
  let productService: ProductsService;
  
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrdersService, UsersService, ProductsService,  {
        provide: getRepositoryToken(Order), // use the token for the repository
        useClass: Repository, // mock the repository class
      },{
        provide: getRepositoryToken(product), // use the token for the repository
        useClass: Repository, // mock the repository class
      }],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    usersService = module.get<UsersService>(UsersService);
    productService = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('Order details test case', async () => {
    // Mock data
    const mockOrderDetails: any = {
      id: 1,
      address: 'Mocked Address',
      status: 'completed',
      price: 100,
      productId: ['4', '8', '14', '15', '16'],
      userId: 37,
    };

    const mockUserDetails: any = {
      id: 37,

      username: 'zain123 ',

      email: 'zainmir1000@gmail.com',

      phone_no: '213423',

      password: '$2b$10$9Gf1UvuAFHEhJV6LEfERnuLgh5XrCl5PsX.tfDXzUolNLGQne3f8.',

      verified: true,

      accessToken:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2VtYWlsIjoiemFpbm1pcjEwMDBAZ21haWwuY29tIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3MDE3MTUxNDEsImV4cCI6MTcwMTgwMTU0MX0.8YFqNbvOcbQDirO2zWRGXEQXmgbq9Fp71ZouMfsmoNE',

      refreshToken:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2VtYWlsIjoiemFpbm1pcjEwMDBAZ21haWwuY29tIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3MDE3MTUxNDEsImV4cCI6MTcwMTgwMTU0MX0.OEWGOz9szumfNeolBfsr1dMxPc4wyasW7eHai3GEM2g',

      role: 'user',

      created_at: new Date('2023-11-12T09:38:01.000Z'),

      updated_at: new Date('2023-11-12T09:38:01.000Z'),
    };
    const mockProductDetails: any = [
      { id: 1, title: 'Mocked Product 1', price: 50 },
      { id: 2, title: 'Mocked Product 2', price: 75 },
    ];
    // Mock the repository and service methods
    jest
      .spyOn(service['orderRepository'], 'findOneBy')
      .mockResolvedValue(mockOrderDetails);
    jest.spyOn(usersService, 'findOne').mockResolvedValue(mockUserDetails);
    jest
      .spyOn(productService, 'findProductsByIds')
      .mockResolvedValue(mockProductDetails);

    // Execute the function
    const result = await service.findOne(1);
    // Assertions
    expect(result).toEqual({
      user: {
        username: mockUserDetails.username,
        email: mockUserDetails.email,
        phone_no: mockUserDetails.phone_no,
      },
      orderDetails: {
        address: mockOrderDetails.address,
        status: mockOrderDetails.status,
        price: mockOrderDetails.price,
      },
      productDetails: mockProductDetails,
    });
  });

  it('User placing order',async ()=>{
  
  })
});
