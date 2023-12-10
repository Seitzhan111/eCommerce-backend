import { Controller, Post, Get, Param, Body, Delete, Patch, UseGuards } from "@nestjs/common";
import { OrderService } from './order.service';
import { Order, Orders_status } from "./models/order.model";
import { JwtAuthGuard } from "../../guards/jwt.guard";
import { CreateOrderDto } from "./dto/order-dto";

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createOrder(@Body() createOrderDto: CreateOrderDto): Promise<{ message: string, order?: Order, error?: string }> {
    try {
      const createdOrder = await this.orderService.createOrder(createOrderDto);
      return { message: 'Заказ успешно создан', order: createdOrder };
    } catch (error) {
      return { message: 'Ошибка при создании заказа', error: error.message };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get(':orderId')
  async getOrder(@Param('orderId') orderId: number) {
    return this.orderService.getOrder(orderId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':orderId/update-status')
  async updateOrderStatus(
    @Param('orderId') orderId: number,
    @Body('status') newStatus: Orders_status,
  ) {
    return this.orderService.updateOrderStatus(orderId, newStatus);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':orderId')
  async deleteOrder(@Param('orderId') orderId: number) {
    return this.orderService.deleteOrder(orderId);
  }
}