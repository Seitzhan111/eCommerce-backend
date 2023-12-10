import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from '@nestjs/sequelize';
import { OrderService } from '../order/order.service';
import { v4 as uuidv4 } from 'uuid';
import { Payment } from "./models/payment.model";
import { Orders_status } from "../order/models/order.model";
import { CreatePaymentDto } from "./dto";

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(Payment) private paymentModel: typeof Payment,
    private readonly orderService: OrderService,
  ) {}

  async processPayment(paymentData: CreatePaymentDto, orderId: number): Promise<string> {
    try {
      const isPaymentSuccessful = Math.random() < 0.8;
      const paymentStatus = isPaymentSuccessful ? 'success' : 'failure';

      const payment = await this.paymentModel.create({
        amount: paymentData.amount,
        transactionId: uuidv4(),
        status: paymentStatus,
        paymentDate: new Date(),
        orderId: orderId,
      });

      if (isPaymentSuccessful) {
        await this.orderService.updateOrderStatus(orderId, Orders_status.PAID);
      } else {
        await this.orderService.updateOrderStatus(orderId, Orders_status.CANCELLED);
      }

      return paymentStatus;
    }catch (error) {
      throw new BadRequestException(error);
    }
  }
}