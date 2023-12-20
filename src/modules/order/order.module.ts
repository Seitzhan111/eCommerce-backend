import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { SequelizeModule } from "@nestjs/sequelize";
import { Order } from "./models/order.model";
import { OrderDetail } from "./models/order-detail.model";
import { Delivery } from "./models/delivery.model";

@Module({
  imports: [SequelizeModule.forFeature([Order, OrderDetail, Delivery])],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService]
})
export class OrderModule {}
