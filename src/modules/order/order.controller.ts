import { Controller, Post, Body, Req } from "@nestjs/common";
import { OrderService } from './order.service';
import { CreateOrderDto } from "./dto/order-dto";

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder(@Body() createOrderDto: CreateOrderDto, @Req() req) {
    const userId: number = req.body.userId
    return this.orderService.createOrder(createOrderDto, userId);
  }
}


