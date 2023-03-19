const { Model, DataTypes } = require("sequelize");
const sequelize = require("./sequelize");

class Room extends Model {}

Room.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "user_id",
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

module.exports = Room;
