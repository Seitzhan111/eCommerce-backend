import { Controller, Post, Get, Param, Body, Put, Delete, ParseIntPipe, UseGuards } from "@nestjs/common";
import { OrderDetailService } from './order-detail.service';
import { OrderDetail } from "./models/order-detail.model";
import { JwtAuthGuard } from "../../guards/jwt.guard";
import { CreateOrderDetailDto } from "./dto/order-detail.dto";

@Controller('order-details')
export class OrderDetailController {
  constructor(private readonly orderDetailService: OrderDetailService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createOrderDetail(@Body() createOrderDetailDto: CreateOrderDetailDto): Promise<{ message: string; orderDetail: OrderDetail } | { message: string; error: string }> {
    try {
      const createdOrderDetail = await this.orderDetailService.createOrderDetail(createOrderDetailDto);
      return { message: 'OrderDetail успешно создан', orderDetail: createdOrderDetail };
    } catch (error) {
      return { message: 'Ошибка при создании OrderDetail', error: error.message };
    }
  }


  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getOrderDetailById(@Param('id', ParseIntPipe) orderDetailId: number): Promise<OrderDetail> {
    return this.orderDetailService.getOrderDetailById(orderDetailId);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  updateOrderDetail(
    @Param('id', ParseIntPipe) orderDetailId: number,
    @Body() orderDetailData: CreateOrderDetailDto,
  ): Promise<OrderDetail> {
    return this.orderDetailService.updateOrderDetail(orderDetailId, orderDetailData);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deleteOrderDetail(@Param('id', ParseIntPipe) orderDetailId: number): Promise<void> {
    return this.orderDetailService.deleteOrderDetail(orderDetailId);
  }
}