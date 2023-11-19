import {Column, Model, Table} from "sequelize-typescript";

@Table
export class User extends Model {
    @Column
    fullName: string

    @Column
    username: string

    @Column
    email: string

    @Column
    phone: string

    @Column
    password: string

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