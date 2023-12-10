import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from '@nestjs/sequelize';
import { OrderDetail } from "./models/order-detail.model";
import { CreateOrderDetailDto } from "./dto/order-detail.dto";

@Injectable()
export class OrderDetailService {
  constructor(
    @InjectModel(OrderDetail)
    private readonly orderDetailModel: typeof OrderDetail,
  ) {}

  async createOrderDetail(orderDetailData: CreateOrderDetailDto): Promise<OrderDetail> {
    try {
      if (!orderDetailData || !orderDetailData.orderId) {
        throw new BadRequestException('orderId не предоставлен в данных');
      }
      return this.orderDetailModel.create({
        ...orderDetailData,
        orderId: orderDetailData.orderId,
      });
    }catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getOrderDetailById(orderDetailId: number): Promise<OrderDetail> {
    try {
      const orderDetail = await this.orderDetailModel.findByPk(orderDetailId);
      if (!orderDetail) {
        throw new NotFoundException('Детали заказа не найдены');
      }
      return orderDetail;
    }catch (error) {
      throw new BadRequestException(error);
    }
  }

  async updateOrderDetail(orderDetailId: number, orderDetailData: CreateOrderDetailDto): Promise<OrderDetail> {
    try {
      const [updatedRowsCount, [updatedOrderDetail]] = await this.orderDetailModel.update(
        orderDetailData,
        {
          where: { id: orderDetailId },
          returning: true,
        },
      );

      if (updatedRowsCount === 0) {
        throw new NotFoundException('Детали заказа не найдены');
      }

      return updatedOrderDetail;
    }catch (error) {
      throw new BadRequestException(error);
    }
  }

  async deleteOrderDetail(orderDetailId: number): Promise<void> {
    try {
      const deletedRowsCount = await this.orderDetailModel.destroy({
        where: { id: orderDetailId },
      });

      if (deletedRowsCount === 0) {
        throw new NotFoundException('Детали заказа не найдены');
      }
    }catch (error) {
      throw new BadRequestException(error);
    }
  }
}