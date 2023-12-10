import { Controller, Post, Body, Param, UseGuards } from "@nestjs/common";
import { PaymentService } from './payment.service';
import { Orders_status } from "../order/models/order.model";
import { OrderService } from "../order/order.service";
import { JwtAuthGuard } from "../../guards/jwt.guard";

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService,
              private readonly orderService: OrderService
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post(':orderId')
  async processPayment(
    @Body() paymentData: any,
    @Param('orderId') orderId: number,
  ) {
    const paymentStatus = await this.paymentService.processPayment(paymentData, orderId);

    if (paymentStatus === 'success') {
      await this.orderService.updateOrderStatus(orderId, Orders_status.PAID);
    } else {
      await this.orderService.updateOrderStatus(orderId, Orders_status.CANCELLED);
    }
    return { status: paymentStatus, orderId };
  }
}