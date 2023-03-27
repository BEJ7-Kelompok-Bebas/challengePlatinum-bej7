const { Model, DataTypes } = require("sequelize");
const sequelize = require("./sequelize");

class Message extends Model {}

Message.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "user_id",
    },
    room_id: {
      type: DataTypes.STRING,
      field: "room_id",
    },
    text: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize: sequelize,
    timestamps: true,
    paranoid: true,
    underscored: true,
    deletedAt: "deleted_at",
    updatedAt: "updated_at",
    createdAt: "created_at",
  },
);

module.exports = Message;
