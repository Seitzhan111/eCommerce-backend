import { Table, Model, Column, DataType, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { Order } from "../../order/models/order.model";

@Table
export class Payment extends Model {
  @Column(DataType.FLOAT)
  amount: number;

  @Column(DataType.UUID)
  transactionId: string;

  @Column(DataType.ENUM('success', 'failure'))
  status: string;

  @Column(DataType.DATE)
  paymentDate: Date;

  @ForeignKey(() => Order)
  @Column(DataType.INTEGER)
  orderId: number;

  @BelongsTo(() => Order)
  order: Order;
}