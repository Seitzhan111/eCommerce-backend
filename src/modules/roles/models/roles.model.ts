import {BelongsToMany, Column, DataType, HasMany, Model, Table} from "sequelize-typescript";
import {User} from "../../users/models/user.model";
import {UserRoles} from "./user-roles.model";

@Table
export class Role extends Model {
    @Column(DataType.STRING)
    value: string

    @BelongsToMany(() => User, () => UserRoles)
    users: User[]
}