"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "order_items",
      [
        {
          order_id: 1,
          item_id: 1,
          qty: 5,
          price: 10000,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          order_id: 1,
          item_id: 2,
          qty: 1,
          price: 15000,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          order_id: 2,
          item_id: 1,
          qty: 5,
          price: 10000,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          order_id: 2,
          item_id: 2,
          qty: 1,
          price: 15000,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          order_id: 3,
          item_id: 2,
          qty: 2,
          price: 15000,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          order_id: 3,
          item_id: 3,
          qty: 2,
          price: 25000,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {},
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(
      "order_items",
      null,
      {},
    );
  },
};
