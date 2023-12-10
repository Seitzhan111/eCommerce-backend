import { Module } from '@nestjs/common';
import { OrderDetailController } from './order-detail.controller';
import { OrderDetailService } from './order-detail.service';
import { SequelizeModule } from "@nestjs/sequelize";
import { OrderDetail } from "./models/order-detail.model";

@Module({
  imports: [SequelizeModule.forFeature([OrderDetail])],
  controllers: [OrderDetailController],
  providers: [OrderDetailService]
})
export class OrderDetailModule {}
