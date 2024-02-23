import { UpdateOrderDto } from '../dto/update-order.dto';
import { product } from 'src/Products/entities/product.entities';
import { Order } from '../entities/order.entity';
// Mock data for orders
export const MockOrderDataDetail: UpdateOrderDto = {
  address: '1232 house and airport',
  status: 'completed',
  price: 12323,
  productId: [27,28,29],
  userId: 37,
};

export const mock_order_instance = Object.assign(
  new Order(),
  MockOrderDataDetail,
);

export const order_placed_expected_result:any = {
  id: 2,
  address: '1232 house and airport',
  status: 'completed',
  price: 12323,
  productId: [27,28,29],
  userId: 37,
};

export const mockUserDetails: any = {
  id: 39,
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

export const mock_order_results:any = [
  {
    id: 27,
    title: 'Nikes2',
    description: 'Nikes',
    categoryId: 1,
    price: 1232,
    image: [
      'picture-957c.jpg',
      'Screenshot 2023-03-25 155251-f9a9.png',
      'Screenshot 2023-04-08 143359-2610d.png',
    ],
  },
  {
    id: 28,
    title: 'description',
    description: 'Vest for gym and image23',
    categoryId: 1,
    price: 1236546,
    image: ['picture-f959.jpg', 'Role guard-a876.jpg'],
  },
  {
    id: 29,
    title: 'description',
    description: 'Vest for gym and image23',
    categoryId: 1,
    price: 1236546,
    image: ['picture-f959.jpg', 'Role guard-a876.jpg'],
  },
];
