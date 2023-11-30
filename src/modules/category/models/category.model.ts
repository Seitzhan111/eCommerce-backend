import {Model, Column, HasMany, Table} from 'sequelize-typescript';
import { Product } from '../../products/models/product.model';

@Table
export class Category extends Model {
    @Column
    name: string;

    @HasMany(() => Product, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    })
    products: Product[];
}