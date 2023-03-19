const User = require("./users.model");
const Item = require("./items.model");
const Order = require("./orders.model");
const OrderItem = require("./order-item.model");
const sequelize = require("./sequelize");
const Message = require("./message");
const Room = require("./rooms");

//Relasi User - Item
User.hasMany(Item, {
  foreignKey: "user_id",
});

Item.belongsTo(User, {
  foreignKey: "user_id",
});

// Relasi User - Order
User.hasMany(Order, {
  foreignKey: "user_id",
});

Order.belongsTo(User, {
  foreignKey: "user_id",
});

//Relasi Item - OrderItem
Item.hasMany(OrderItem, {
  foreignKey: "item_id",
});

OrderItem.belongsTo(Item, {
  foreignKey: "item_id",
});

//Relasi Order - OrderItem
Order.hasMany(OrderItem, {
  foreignKey: "order_id",
});

OrderItem.belongsTo(Order, {
  foreignKey: "order_id",
});

Order.belongsToMany(Item, { through: OrderItem });
Item.belongsToMany(Order, { through: OrderItem });

// User - Room
User.hasMany(Room, {
  foreignKey: "user_id",
});
Room.belongsTo(User, {
  foreignKey: "user_id",
});

// User - Message
User.hasMany(Message, {
  foreignKey: "user_id",
});
Message.belongsTo(User, {
  foreignKey: "user_id",
});

// Room - Message
Room.hasMany(Message, {
  foreignKey: "room_id",
});
Message.belongsTo(Room, {
  foreignKey: "room_id",
});

module.exports = {
  User,
  Item,
  Order,
  OrderItem,
  Room,
  Message,
  sequelize,
};
