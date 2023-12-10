import {
    BelongsTo,
    Column,
    DataType,
    ForeignKey,
    Model,
    Table
} from "sequelize-typescript";
import {Category} from "../../category/models/category.model";

enum ProductStatus {
    InStock = 'есть в наличии',
    OutOfStock = 'нет в наличии',
}

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

    @ForeignKey(() => Category)
    @Column(DataType.INTEGER)
    categoryId: number;

    @BelongsTo(() => Category)
    category: Category;

    @Column({
        type: DataType.ENUM(...Object.values(ProductStatus)),
    })
    status: ProductStatus;

    @Column(DataType.INTEGER)
    quantity: number;
}
