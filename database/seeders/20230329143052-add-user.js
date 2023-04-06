const { Hash } = require("../../modules");

("use strict");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "users",
      [
        {
          email: "admin1@gmail.com",
          username: "admin1",
          password: await Hash.hashing("12345678"),
          role: "admin",
          register_status: "Validated",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          email: "user1@gmail.com",
          username: "user1",
          password: await Hash.hashing("12345678"),
          role: "user",
          register_status: "Validated",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          email: "user2@gmail.com",
          username: "user2",
          password: await Hash.hashing("12345678"),
          role: "user",
          register_status: "Validated",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          email: "user3@gmail.com",
          username: "user3",
          password: await Hash.hashing("12345678"),
          role: "user",
          register_status: "Validated",
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {},
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("users", null, {});
  },
};
