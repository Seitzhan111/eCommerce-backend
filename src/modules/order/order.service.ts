import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from '@nestjs/sequelize';
import { Order, Orders_status } from "./models/order.model";
import { CreateOrderDto } from "./dto/order-dto";
import { OrderDetail } from "./models/order-detail.model";
import { Delivery } from "./models/delivery.model";

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order)
    private readonly orderModel: typeof Order,
    @InjectModel(OrderDetail)
    private readonly orderDetailModel: typeof OrderDetail,
    @InjectModel(Delivery)
    private readonly deliveryModel: typeof Delivery,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto, userId: number) {
    const { status, orderDetails, delivery } = createOrderDto;


    const transaction = await this.orderModel.sequelize.transaction();

    try {
      const order = await this.orderModel.create(
        {
          status,
          userId,
          orderDetails: orderDetails.map((detail) => ({
            product: detail.product,
            quantity: detail.quantity,
            totalPrice: detail.totalPrice,
          })),
          delivery: {
            deliveryAddress: delivery.deliveryAddress,
            recipientFullName: delivery.recipientFullName,
            recipientPhoneNumber: delivery.recipientPhoneNumber,
            paymentMethod: delivery.paymentMethod,
          },
        },
        {
          include: [
            {
              model: this.orderDetailModel,
              as: 'orderDetails',
              attributes: { exclude: ['createdAt', 'updatedAt'] },
            },
            {
              model: this.deliveryModel,
              as: 'delivery',
              attributes: { exclude: ['createdAt', 'updatedAt'] },
            },
          ],
          transaction,
        },
      );


      await transaction.commit();

      return order;
    } catch (error) {
      await transaction.rollback();
      throw new BadRequestException(error.message);
    }
  }

  async getAllOrders(): Promise<Order[]> {
    try {
      return this.orderModel.findAll({
        include: [
          {
            model: this.orderDetailModel,
            as: 'orderDetails',
          },
          {
            model: this.deliveryModel,
            as: 'delivery',
          },
        ],
      });
    }catch (error) {
      throw new Error(error)
    }
  }

  async getOrderById(orderId: number): Promise<Order | null> {
    try {
      return this.orderModel.findByPk(orderId, {
        include: [
          {
            model: this.orderDetailModel,
            as: 'orderDetails',
          },
          {
            model: this.deliveryModel,
            as: 'delivery',
          },
        ],
      });
    }catch (error) {
      throw new Error(error)
    }
  }

  async payment(orderId: number): Promise<void> {
    try {
      const order = await this.orderModel.findByPk(orderId);

      if (!order) {
        throw new NotFoundException('Заказ не найден');
      }
      if (order.status === Orders_status.PENDING) {
        order.status = Orders_status.PAID;
        await order.save();
      } else {
        throw new NotFoundException('Нет ожидающего заказа');
      }
    }catch (error) {
      throw new Error(error)
    }
  }

  async cancelOrder(orderId: number): Promise<void> {
    try {
      const order = await this.orderModel.findByPk(orderId);

      if (!order) {
        throw new NotFoundException('Заказ не найден');
      }

      if (order.status !== Orders_status.PAID) {
        throw new BadRequestException('После оплаты невозможно отменить заказ!');
      }
      await order.update({ status: Orders_status.CANCELLED });
    }catch (error) {
      throw new Error(error)
    }
  }

  async markOrderAsShipped(orderId: number): Promise<void> {
    try {
      const order = await this.orderModel.findByPk(orderId);
      if (!order) {
        throw new NotFoundException('Заказ не найден');
      }
      if (order.status == Orders_status.PAID) {
        throw new BadRequestException('Заказ не может быть отправлен до оплаты');
      }
      await order.update({ status: Orders_status.SHIPPED });
    }catch (error) {
      throw new Error(error)
    }
  }
}