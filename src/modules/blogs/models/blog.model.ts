import { Column, DataType, Model, Table } from "sequelize-typescript";

@Table
export class Blog extends Model<Blog> {
  @Column
  title: string;

  @Column
  content: string;

  @Column(DataType.STRING)
  image?: string
}