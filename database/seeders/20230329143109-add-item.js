"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "items",
      [
        {
          id: 1,
          user_id: 1,
          name: "item1",
          price: 10000,
          stock: 100,
          created_at: Date.now(),
          updated_at: Date.now(),
        },
        {
          id: 2,
          user_id: 1,
          name: "item2",
          price: 15000,
          stock: 100,
          created_at: Date.now(),
          updated_at: Date.now(),
        },
        {
          id: 3,
          user_id: 1,
          name: "item3",
          price: 25000,
          stock: 50,
          created_at: Date.now(),
          updated_at: Date.now(),
        },
        {
          id: 4,
          user_id: 1,
          name: "item4",
          price: 20000,
          stock: 60,
          created_at: Date.now(),
          updated_at: Date.now(),
        },
        {
          id: 5,
          user_id: 1,
          name: "item5",
          price: 5000,
          stock: 100,
          created_at: Date.now(),
          updated_at: Date.now(),
        },
      ],
      {},
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("items", null, {});
  },
};
