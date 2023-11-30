import {
    AfterCreate,
    BelongsTo,
    Column,
    DataType,
    ForeignKey,
    Model,
    Table
} from "sequelize-typescript";
import {User} from "../../users/models/user.model";
import {Category} from "../../category/models/category.model";

@Table
export class Product extends Model {
    @Column(DataType.STRING)
    name: string

    @Column(DataType.STRING)
    description: string

    @Column(DataType.INTEGER)
    price: number

    @Column({
        type: DataType.ARRAY(DataType.STRING),
    })
    images: string[]

    @Column(DataType.BOOLEAN)
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
