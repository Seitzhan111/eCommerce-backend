import {BelongsTo, Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import {User} from "../../users/models/user.model";
import {Category} from "../../category/models/category.model";

@Table
export class Product extends Model {
    @Column
    name: string

    @Column
    description: string

    @Column
    price: string

    @Column({
        type: DataType.ARRAY(DataType.STRING),
    })
    images: string[]

    @Column
    sales: boolean

    @ForeignKey(() => User)
    @Column
    userId: number

    @BelongsTo(() => User)
    user: User

    @ForeignKey(() => Category)
    @Column
    categoryId: number;

    @BelongsTo(() => Category)
    category: Category;
}
