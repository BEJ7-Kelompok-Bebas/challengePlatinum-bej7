const { Hash } = require("../../modules");

("use strict");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "users",
      [
        {
          id: 1,
          email: "admin1@gmail.com",
          username: "admin1",
          password:
            "$2y$10$71S4OKMMybMGYOAT.vBMWuAWbePyseOWpPhwjXwV4ukm2riuwjDdS",
          role: "admin",
          register_status: "Validated",
          created_at: Date.now(),
          updated_at: Date.now(),
        },
        {
          id: 2,
          email: "user1@gmail.com",
          username: "user1",
          password:
            "$2y$10$XeZDf9j0a2PSdCAQnEErhuJyPm12DpBl7QkvphNpqCA6xbCVDXnk.",
          role: "user",
          register_status: "Validated",
          created_at: Date.now(),
          updated_at: Date.now(),
        },
      ],
      {},
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("users", null, {});
  },
};
