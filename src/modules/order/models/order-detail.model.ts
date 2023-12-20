import { Table, Model, Column, ForeignKey, BelongsTo } from "sequelize-typescript";
import { Product } from "../../products/models/product.model";
import { Order } from "./order.model";

@Table
export class OrderDetail extends Model {
  @ForeignKey(() => Product)
  @Column
  productId: number;

  @ForeignKey(() => Order)
  @Column
  orderId: number;

  @Column
  quantity: number;

  @Column
  price: number;

  @BelongsTo(() => Product)
  product: Product;

  @BelongsTo(() => Order)
  order: Order;
}