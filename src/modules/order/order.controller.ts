import { Controller, Post, Body, HttpException, HttpStatus, UseGuards } from "@nestjs/common";
import { OrderService } from './order.service';
import { CreateOrderDto } from "./dto/order-dto";
import { JwtAuthGuard } from "../../guards/jwt.guard";

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    const userId: number = createOrderDto.userId;

    if (userId === undefined) {
      throw new HttpException('userId is required in the request body', HttpStatus.BAD_REQUEST);
    }

    return this.orderService.createOrder(createOrderDto, userId);
  }
}