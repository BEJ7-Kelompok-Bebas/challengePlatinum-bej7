const { Model, DataTypes } = require("sequelize");
const sequelize = require('./sequelize')

class OrderItem extends Model {
}

OrderItem.init(
  {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    order_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'order_id'
    },
    item_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'item_id'
    },
    qty: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    },
    price: {
        type: DataTypes.DOUBLE,
        allowNull: false
    }
  },
  {
    sequelize: sequelize,
    timestamps: true,
    paranoid: true,
    underscored: true,
    deletedAt: 'deleted_at',
    updatedAt: 'updated_at',
    createdAt: 'created_at',
  },
)

module.exports = OrderItem
