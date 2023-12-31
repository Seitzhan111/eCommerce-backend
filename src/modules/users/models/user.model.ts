import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import {Role} from "../../roles/models/roles.model";
import {UserRoles} from "../../roles/models/user-roles.model";
import { OrderDetail } from "../../order/models/order-detail.model";
import { IsOptional } from "class-validator";

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
    @IsOptional()
    roles?: Role[]

    @Column(DataType.STRING)
    avatar?: string

}