"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "orders",
      [
        {
          id: 1,
          user_id: 2,
          total: 65000,
          status: "Complete",
          created_at: Date.now(),
          updated_at: Date.now(),
        },
        {
          id: 2,
          user_id: 2,
          total: 65000,
          status: "Cancelled",
          created_at: Date.now(),
          updated_at: Date.now(),
        },
        {
          id: 3,
          user_id: 3,
          total: 80000,
          status: "Pending",
          created_at: Date.now(),
          updated_at: Date.now(),
        },
      ],
      {},
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("orders", null, {});
  },
};
