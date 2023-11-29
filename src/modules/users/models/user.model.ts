import {Column, DataType, HasMany, Model, Table} from "sequelize-typescript";
import {Product} from "../../products/models/product.model";
import { Category } from "../../category/models/category.model";

@Table
export class User extends Model {
    @Column(DataType.STRING)
    fullName: string

    @Column({
        allowNull: false,
        unique: true,
    })
    username: string

    @Column({
        allowNull: false,
        unique: true,
    })
    email: string

    @Column(DataType.STRING)
    phone: string

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    confirmationCode: string;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    })
    isConfirmed: boolean;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
    })
    isSocialRegistration: boolean;

    @Column({
        allowNull: false,
    })
    password: string

    @Column({
        type: DataType.ENUM('user', 'admin'),
        defaultValue: 'user',
    })
    role: 'user' | 'admin';

    @HasMany(() => Product, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    })
    products: Product[]

    @HasMany(() => Category, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    })
    categories: Category[]

    @Column(DataType.STRING)
    avatar?: string

    @Column(DataType.ARRAY(DataType.STRING))
    images?: string[];

    // @Column
    // posts: string

    // @Column
    // comments: string
}