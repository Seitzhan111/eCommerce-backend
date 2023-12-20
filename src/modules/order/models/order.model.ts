import { Table, Model, Column, DataType, HasMany, HasOne, ForeignKey, BelongsTo } from "sequelize-typescript";
import { OrderDetail } from "./order-detail.model";
import { Delivery } from "./delivery.model";
import { User } from "../../users/models/user.model";

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

  @ForeignKey(() => User)
  @Column
  userId: number;

  @BelongsTo(() => User)
  user: User;
}