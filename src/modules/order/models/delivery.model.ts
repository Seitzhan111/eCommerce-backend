import { Table, Model, Column, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Order } from "./order.model";

@Table({
  timestamps: false,
  defaultScope: {
    attributes: {
      exclude: ['createdAt', 'updatedAt'],
    },
  },
})
export class Delivery extends Model {
  @ForeignKey(() => Order)
  @Column
  orderId: number;

  @Column
  deliveryAddress: string;

  @Column
  recipientFullName: string;

  @Column
  recipientPhoneNumber: string;

  @Column
  paymentMethod: string;

  @BelongsTo(() => Order)
  order: Order;
}