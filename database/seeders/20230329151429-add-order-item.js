"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "order_items",
      [
        {
          id: 1,
          order_id: 1,
          item_id: 1,
          qty: 5,
          price: 10000,
          created_at: Date.now(),
          updated_at: Date.now(),
        },
        {
          id: 2,
          order_id: 1,
          item_id: 2,
          qty: 1,
          price: 15000,
          created_at: Date.now(),
          updated_at: Date.now(),
        },
        {
          id: 3,
          order_id: 2,
          item_id: 1,
          qty: 5,
          price: 10000,
          created_at: Date.now(),
          updated_at: Date.now(),
        },
        {
          id: 4,
          order_id: 2,
          item_id: 2,
          qty: 1,
          price: 15000,
          created_at: Date.now(),
          updated_at: Date.now(),
        },
        {
          id: 5,
          order_id: 3,
          item_id: 2,
          qty: 2,
          price: 15000,
          created_at: Date.now(),
          updated_at: Date.now(),
        },
        {
          id: 6,
          order_id: 3,
          item_id: 3,
          qty: 2,
          price: 25000,
          created_at: Date.now(),
          updated_at: Date.now(),
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
