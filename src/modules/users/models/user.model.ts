import {Column, DataType, Model, Table} from "sequelize-typescript";
import {ApiProperty} from "@nestjs/swagger";
import {IsBoolean} from "class-validator";

@Table
export class User extends Model {
    @Column
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

    @Column
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

    // @Column
    // emailConfirmed: boolean
    //
    // @Column
    // emailConfirmationToken: string

    // @Column
    // avatar: string
    //
    // @Column
    // images: string

    // @Column
    // posts: string

    // @Column
    // comments: string

    // @Column
    // role: string

    // @Column
    // products: string
}