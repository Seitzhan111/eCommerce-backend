import {Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import {Role} from "./roles.model";
import {User} from "../../users/models/user.model";


@Table({createdAt: false, updatedAt: false})
export class UserRoles extends Model {
    @ForeignKey(() => Role)
    @Column(DataType.INTEGER)
    roleId: number

    @ForeignKey(() => User)
    @Column(DataType.INTEGER)
    userId: number
}