import { Module } from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { DeliveryController } from './delivery.controller';
import { Delivery } from "./models/delivery.model";
import { SequelizeModule } from "@nestjs/sequelize";

@Module({
  imports: [SequelizeModule.forFeature([Delivery])],
  providers: [DeliveryService],
  controllers: [DeliveryController],
  exports: [DeliveryService]
})
export class DeliveryModule {}
