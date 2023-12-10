import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { SequelizeModule } from "@nestjs/sequelize";
import { Payment } from "./models/payment.model";
import { OrderModule } from "../order/order.module";

@Module({
  imports: [SequelizeModule.forFeature([Payment]), OrderModule],
  controllers: [PaymentController],
  providers: [PaymentService]
})
export class PaymentModule {}
