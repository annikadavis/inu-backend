import { AutoIncrement, Column, DataType, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table({ tableName: 'Users' })
export default class User extends Model<User> {

  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  public id: number

  @Column(DataType.TEXT)
  public name: string

  @Column(DataType.TEXT)
  public email: string

  @Column(DataType.TEXT)
  public password: string
}