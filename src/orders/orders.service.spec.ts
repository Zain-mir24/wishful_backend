import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { ProductsService } from '../Products/products.service';
import { UsersService } from '../users/users.service';
import { Order } from './entities/order.entity';
import { product } from '../Products/entities/product.entities';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  mock_order_instance,
  order_placed_expected_result,
  mockUserDetails,
  mock_order_results,
  MockOrderDataDetail,
} from './mocks';
jest.mock('../users/users.service');
describe('OrdersService', () => {
  let service: OrdersService;
  let usersService: UsersService;
  let productService: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        UsersService,
        ProductsService,
        {
          provide: getRepositoryToken(Order), // use the token for the repository
          useClass: Repository, // mock the repository class
        },
        {
          provide: getRepositoryToken(product), // use the token for the repository
          useClass: Repository, // mock the repository class
        },
      ],
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

  it('should return the expected order when placing an order', async () => {
    const check_user = jest
      .spyOn(usersService, 'findOne')
      .mockResolvedValue(mockUserDetails);

    const verify_product = jest
      .spyOn(productService, 'findProductsByIds')
      .mockResolvedValue(mock_order_results);
    // Mocking order creation and save
    const create_order = jest
      .spyOn(service['orderRepository'], 'create')
      .mockReturnValueOnce(order_placed_expected_result); // Replace mockOrderDataDetail with your expected order data

    const save_order = jest
      .spyOn(service['orderRepository'], 'save')
      .mockResolvedValueOnce(order_placed_expected_result);
    const result = await usersService.findOne(mockUserDetails.id);

    let is_product_exists = await productService.findProductsByIds(
      MockOrderDataDetail.productId,
    );
    // Call the logic for creating and saving an order
    const add = service['orderRepository'].create(MockOrderDataDetail);
    const order_placed = await service['orderRepository'].save(add);
    // Assertions
    expect(check_user).toHaveBeenCalledWith(mockUserDetails.id); // Check if the spy was called with the expected argument
    expect(result).toEqual(mockUserDetails); // Check if the method produced the expected result

    expect(verify_product).toHaveBeenCalledWith(MockOrderDataDetail.productId);
    expect(is_product_exists).toEqual(mock_order_results);

    // Check if the order was created with the correct data
    expect(create_order).toHaveBeenCalledWith(MockOrderDataDetail);
    // Check if the order was saved successfully
    expect(save_order).toHaveBeenCalledWith(order_placed_expected_result);

    expect(order_placed).toEqual(order_placed_expected_result);
  });
});
