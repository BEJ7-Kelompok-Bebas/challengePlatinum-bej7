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
          password: new Hash.hashing("12345678"),
          role: "admin",
          created_at: Date.now(),
          updated_at: Date.now(),
        },
        {
          id: 2,
          email: "user1@gmail.com",
          username: "user1",
          password: new Hash.hashing("12345678"),
          role: "user",
          created_at: Date.now(),
          updated_at: Date.now(),
        },
        {
          id: 3,
          email: "user2@gmail.com",
          username: "user2",
          password: new Hash.hashing("12345678"),
          role: "user",
          created_at: Date.now(),
          updated_at: Date.now(),
        },
        {
          id: 4,
          email: "user3@gmail.com",
          username: "user3",
          password: new Hash.hashing("12345678"),
          role: "user",
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