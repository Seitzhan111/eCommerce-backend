import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from '@nestjs/sequelize';
import { Order, Orders_status } from "./models/order.model";
import { Delivery } from "../delivery/models/delivery.model";
import { CreateOrderDto } from "./dto/order-dto";
import { OrderDetail } from "../order-detail/models/order-detail.model";

@Injectable()
export class OrderService {
  constructor(@InjectModel(Order) private orderModel: typeof Order) {}

  async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    try {
      const order = await this.orderModel.create({
        status: createOrderDto.status,
        orderDetails: createOrderDto.orderDetails,
        delivery: createOrderDto.delivery,
      }, { include: [OrderDetail, Delivery] });
      return order;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }


  async getOrder(orderId: number): Promise<Order | null> {
    try {
      const existOrder = await this.orderModel.findByPk(orderId);
      if (!existOrder) throw new NotFoundException('Такого заказа не существует')
      return existOrder
    }catch (error) {
      throw new BadRequestException(error);
    }
  }

  async updateOrderStatus(orderId: number, newStatus: Orders_status): Promise<Order> {
   try {
     const order = await this.orderModel.findByPk(orderId);

     if (!order) {
       throw new NotFoundException('Такого заказа не существует');
     }
     order.status = newStatus;
     return order.save();
   }catch (error) {
     throw new BadRequestException(error);
   }
  }

  async deleteOrder(orderId: number): Promise<number> {
    try {
      return this.orderModel.destroy({ where: { id: orderId } });
    }catch (error) {
      throw new BadRequestException(error);
    }
  }
}