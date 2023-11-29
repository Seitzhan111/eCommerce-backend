import {BelongsTo, Column, ForeignKey, HasMany, Model, Table} from "sequelize-typescript";
import {Product} from "../../products/models/product.model";
import {User} from "../../users/models/user.model";

@Table
export class Category extends Model {
    @Column
    name: string

    @HasMany(() => Product)
    products: Product[];

    @ForeignKey(() => User)
    @Column({ references: { model: User, key: 'id' } })
    userId: number;

    @BelongsTo(() => User)
    user: User;
}