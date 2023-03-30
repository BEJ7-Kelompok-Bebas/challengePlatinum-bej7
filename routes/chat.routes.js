const {
  User,
  Room,
  Message,
} = require("../database/models");
const { ioAuthenticator } = require("../middleware");
const { ChatController } = require("../controller");

const chatController = new ChatController(
  User,
  Room,
  Message,
  ioAuthenticator,
);

const chatRoute = (io) => {
  io.of("/chat").on("connection", (socket) => {
    chatController.startChat(socket);
  });
};

module.exports = { chatRoute };
