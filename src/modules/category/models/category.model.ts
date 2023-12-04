import { Model, Column, HasMany, Table, DataType } from "sequelize-typescript";
import { Product } from '../../products/models/product.model';

@Table
export class Category extends Model {
    @Column(DataType.STRING)
    name: string;

    @HasMany(() => Product, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    })
    products: Product[];
}