"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "orders",
      [
        {
          user_id: 2,
          total: 65000,
          status: "Complete",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          user_id: 2,
          total: 65000,
          status: "Cancelled",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          user_id: 3,
          total: 80000,
          status: "Pending",
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {},
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("orders", null, {});
  },
};
