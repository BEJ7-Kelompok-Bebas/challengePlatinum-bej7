"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "items",
      [
        {
          user_id: 1,
          name: "item1",
          price: 10000,
          stock: 10000,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          user_id: 1,
          name: "item2",
          price: 15000,
          stock: 10000,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          user_id: 1,
          name: "item3",
          price: 25000,
          stock: 10000,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          user_id: 1,
          name: "item4",
          price: 20000,
          stock: 10000,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          user_id: 1,
          name: "item5",
          price: 5000,
          stock: 10000,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {},
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("items", null, {});
  },
};
