import { BelongsToMany, Column, DataType, HasOne, Model, Table } from "sequelize-typescript";
import {Role} from "../../roles/models/roles.model";
import {UserRoles} from "../../roles/models/user-roles.model";
import { Cart } from "../../cart/models/cart.model";

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

    @BelongsToMany(() => Role, () => UserRoles)
    roles: Role[]

    @Column(DataType.STRING)
    avatar?: string

    @Column(DataType.ARRAY(DataType.STRING))
    images?: string[];

    @HasOne(() => Cart)
    cart: Cart;

}