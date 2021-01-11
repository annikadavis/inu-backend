import { AutoIncrement, Column, DataType, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table({ tableName: 'ResetTokens' })
export default class ResetToken extends Model<ResetToken> {

  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  public id: number

  @Column(DataType.TEXT)
  public email: string

  @Column(DataType.TEXT)
  public token: string
}