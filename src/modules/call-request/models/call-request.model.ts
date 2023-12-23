import { Table, Model, Column, DataType } from 'sequelize-typescript';

@Table
export class CallRequest extends Model<CallRequest> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  phoneNumber: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  callbackTime: Date;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  comment: string;
}