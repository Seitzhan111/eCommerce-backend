import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from '@nestjs/sequelize';
import { Order } from "./models/order.model";
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
            productId: detail.productId,
            quantity: detail.quantity,
            price: detail.price,
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
            { model: this.orderDetailModel, as: 'orderDetails' },
            { model: this.deliveryModel, as: 'delivery' },
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
}