import {Column, Model, Table, Unique} from "sequelize-typescript";

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