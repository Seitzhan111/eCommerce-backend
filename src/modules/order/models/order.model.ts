import { Table, Model, Column, DataType, HasMany, HasOne } from "sequelize-typescript";
import { OrderDetail } from "../../order-detail/models/order-detail.model";
import { Delivery } from "../../delivery/models/delivery.model";

export enum Orders_status {
  PENDING = 'pending',
  PAID = 'paid',
  SHIPPED = 'shipped',
  CANCELLED = 'cancelled',
}

@Table
export class Order extends Model {
  @Column({
    type: DataType.ENUM(...Object.values(Orders_status)),
    allowNull: false,
    defaultValue: Orders_status.PENDING,
  })
  status: Orders_status;

  @HasMany(() => OrderDetail)
  orderDetails: OrderDetail[];

  @HasOne(() => Delivery)
  delivery: Delivery;
}