import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { Product } from "../../products/models/product.model";
import { User } from "../../users/models/user.model";

@Table
export class Cart extends Model {
  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @HasMany(() => Product)
  products: Product[];

  quantity: number;
}