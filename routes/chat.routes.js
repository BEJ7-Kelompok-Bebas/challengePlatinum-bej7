const { ChatController } = require("../controller");

const chatController = new ChatController();

const chatRoute = (io) => {
  io.of("/chat").on("connection", (socket) => {
    chatController.startChat(socket);
  });
};

module.exports = { chatRoute };
