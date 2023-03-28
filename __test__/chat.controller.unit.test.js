const {
  ChatController,
} = require("../controller/chat.controller");
const mockIoAuth = jest
  .fn()
  .mockImplementation((socket) => {
    return { user_id: 1 };
  });
