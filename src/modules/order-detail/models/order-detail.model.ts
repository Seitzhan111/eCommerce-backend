import { Table, Model, Column, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Order } from '../../order/models/order.model';
import { Product } from "../../products/models/product.model";
import { User } from "../../users/models/user.model";

@Table
export class OrderDetail extends Model {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    validate: {
      isInt: true,
      min: 1,
    },
  })
  quantity: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
    validate: {
      isFloat: true,
      min: 0,
    },
  })
  price: number;

  @ForeignKey(() => Product)
  @Column(DataType.INTEGER)
  productId: number;

  @BelongsTo(() => Product)
  product: Product;

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