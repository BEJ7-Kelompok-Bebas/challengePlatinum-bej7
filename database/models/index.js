const User = require('./users.model')
const Item = require('./items.model')
const Order = require('./orders.model')
const OrderItem = require('./order-item.model')
const sequelize = require('./sequelize')

//Relasi User - Item
User.hasMany(Item, {
  foreignKey: 'user_id'
})

Item.belongsTo(User, {
  foreignKey: 'user_id'
})

// Relasi User - Order
User.hasMany(Order, {
  foreignKey: 'user_id'
})

Order.belongsTo(User, {
  foreignKey: 'user_id'
})

//Relasi Item - OrderItem
Item.hasMany(OrderItem, {
  foreignKey: 'item_id'
})

OrderItem.belongsTo(Item, {
  foreignKey: 'item_id'
})

//Relasi Order - OrderItem
Order.hasMany(OrderItem, {
  foreignKey: 'order_id'
})

OrderItem.belongsTo(Order, {
  foreignKey: 'order_id'
})


Order.belongsToMany(Item,{through:OrderItem})
Item.belongsToMany(Order,{through:OrderItem})


module.exports = {
  User,
  Item,
  Order,
  OrderItem,
  sequelize
}
