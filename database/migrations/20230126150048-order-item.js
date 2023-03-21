'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('order_items', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      order_id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "orders",
          key: "id",
          as: "order_id"
        }
      },
      item_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "items",
          key: "id",
          as: "item_id"
        }
      },
      qty: {
        type: Sequelize.INTEGER,
        defaultValue: 1
      },
      price: {
        type: Sequelize.DOUBLE,
        allowNull: false
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Date.now()
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Date.now()
      },
      deleted_at: {
        type: Sequelize.DATE
      }
    });
  
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('order_items');
  }
};
