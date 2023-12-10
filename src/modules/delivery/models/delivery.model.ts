import { Table, Model, Column, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from "../../users/models/user.model";
import { Order } from "../../order/models/order.model";

@Table
export class Delivery extends Model {
  @Column(DataType.STRING)
  deliveryAddress: string;

  @Column(DataType.STRING)
  recipientFullName: string;

  @Column(DataType.STRING)
  recipientPhoneNumber: string;

  @Column(DataType.STRING)
  paymentMethod: string;

  @ForeignKey(() => Order)
  @Column(DataType.INTEGER)
  orderId: number;

  @BelongsTo(() => Order)
  order: Order;

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  userId: number;

  @BelongsTo(() => User)
  user: User;
}