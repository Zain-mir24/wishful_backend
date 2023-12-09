import { CreateOrderDto } from '../dto/create-order.dto';
export type orderSuccess = {
  Message: string;
  data: CreateOrderDto;
}
type OrderDetails = {
  address: string;
  status: string;
  price: number;
};

type ProductDetails = {
  id: number;
  title: string;
  description: string;
  categoryId: number;
  price: number;
};

type UserDetails = {
  username: string;
  email: string;
  phone_no: string;
};

export type OrderResponse = {
  user: UserDetails;
  orderDetails: OrderDetails;
  productDetails: ProductDetails[];
};
