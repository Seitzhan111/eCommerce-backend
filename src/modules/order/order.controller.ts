import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  UseGuards,
  Get,
  Param,
  NotFoundException, ParseIntPipe, Patch
} from "@nestjs/common";
import { OrderService } from './order.service';
import { CreateOrderDto } from "./dto/order-dto";
import { JwtAuthGuard } from "../../guards/jwt.guard";
import { Category } from "../category/models/category.model";
import { Order } from "./models/order.model";

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

  @Get()
  async getAllOrders() {
    return this.orderService.getAllOrders();
  }

  @Get(':id')
  async getOrder(@Param('id') orderId: number) {
    return this.orderService.getOrderById(orderId);
  }

  @Patch(':orderId/payment')
  async payment(@Param('orderId') orderId: number) {
    try {
      const paymentResult = await this.orderService.payment(orderId);
      return paymentResult
    } catch (error) {
      if (error instanceof NotFoundException) {
        return { message: 'Заказ не найден', error: error.message };
      }
      return { message: 'Ошибка с оплатой', error: error.message };
    }
  }
  @Patch(':id/cancel')
  async cancelOrder(@Param('id', ParseIntPipe) orderId: number) {
    await this.orderService.cancelOrder(orderId);
    return { message: 'Заказ успешно отменен!' };
  }

  @Patch(':id/shipped')
  async markOrderAsShipped(@Param('id', ParseIntPipe) orderId: number) {
    await this.orderService.markOrderAsShipped(orderId);
    return { message: 'Заказ успешно отправлен' };
  }
}