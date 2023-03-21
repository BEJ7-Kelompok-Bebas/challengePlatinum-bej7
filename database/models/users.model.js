const { Model, DataTypes } = require("sequelize");
const sequelize = require("./sequelize");

class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    register_status: {
      type: DataTypes.ENUM("Validated", "Pending", "Cancelled"),
      allowNull: false,
      defaultValue: "Pending",
    },
    verification_token: {
      type: DataTypes.STRING,
      allowNull: true,
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
  }
);

module.exports = User;
