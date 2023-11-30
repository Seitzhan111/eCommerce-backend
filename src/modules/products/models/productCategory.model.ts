import {Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import {Product} from "./product.model";
import {Category} from "../../category/models/category.model";
@Table
export class ProductCategory extends Model {
    @ForeignKey(() => Product)
    @Column({ type: DataType.INTEGER })
    productId: number;

    @ForeignKey(() => Category)
    @Column({ type: DataType.INTEGER })
    categoryId: number;
}