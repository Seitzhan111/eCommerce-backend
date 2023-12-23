import { Table, Model, Column, ForeignKey, BelongsTo, DataType } from "sequelize-typescript";
import { Product } from "../../products/models/product.model";
import { Order } from "./order.model";

@Table({
  timestamps: false,
  defaultScope: {
    attributes: {
      exclude: ['createdAt', 'updatedAt'],
    },
  },
})
export class OrderDetail extends Model {
  @ForeignKey(() => Product)
  @Column({
    type: DataType.JSON,
  })
  product: Product;

  @ForeignKey(() => Order)
  @Column
  orderId: number;

  @Column
  quantity: number;

  @Column
  totalPrice: number;

  @BelongsTo(() => Order)
  order: Order;
}