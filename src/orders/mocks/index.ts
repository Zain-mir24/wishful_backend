import { UpdateOrderDto } from "../dto/update-order.dto";
import { Order } from "../entities/order.entity";
// Mock data for orders  
const MockOrderDataDetail:UpdateOrderDto=
    {
        "address": "1232 house and airport",
        "status": "completed",
        "price": 12323,
        "productId":[4,8,14,15],
        "userId":37
    }
