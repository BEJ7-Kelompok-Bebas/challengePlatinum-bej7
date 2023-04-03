class ChatController {
  constructor(userModel, roomModel, messageModel, ioAuth) {
    this.userModel = userModel;
    this.roomModel = roomModel;
    this.messageModel = messageModel;
    this.ioAuth = ioAuth;
  }

  async startChat(socket) {
    console.log("User connected");
    const { id: user_id } = this.ioAuth(socket);

    const r_username = socket.handshake.query.r_username;

    const sender = await this.userModel.findOne({
      where: {
        id: user_id,
      },
      attributes: ["id", "username", "role"],
    });

    let roomName;

    if (sender.role === "admin") {
      roomName = `${r_username}${sender.username}`;
    } else {
      roomName = `${sender.username}${r_username}`;
    }

    const receiver = await this.userModel.findOne({
      where: {
        username: r_username,
      },
    });

    if (!receiver) {
      return new ErrorResponse(404, "User Not Found");
    }
    let attr = {};
    if (sender.role === "user") {
      attr = { name: roomName, user_id: user_id };
    } else {
      attr = { name: roomName };
    }

    let room = await this.roomModel.findOne({
      where: attr,
    });

    if (!room) {
      room = await this.roomModel.create(attr);
    }
    const room_id = room.id;

    socket.data = {
      room_id: room_id,
      roomName: attr.name,
      username: sender.username,
      id: user_id,
    };

    socket.join(attr.name);
    this.chatHistory(socket);

    socket.on("send", async (data) => {
      const addMessage = this.messageModel.create({
        user_id: socket.data.id,
        text: data,
        room_id: socket.data.room_id,
      });

      socket.to(socket.data.roomName).emit("send", {
        message: data,
        username: socket.data.username,
      });
    });

    socket.on("disconnect", () => {
      console.log("User Disconnected");
    });
  }

  async chatHistory(socket) {
    const { room_id, roomName } = socket.data;
    const messages = await this.messageModel.findAll({
      where: {
        room_id,
      },
      order: [["created_at", "ASC"]],
      include: [
        {
          model: this.userModel,
          attributes: ["id", "username"],
        },
      ],
    });

    messages.forEach((element) => {
      socket.to(roomName).emit("chatHistory", {
        message: element.text,
        username: element.User.username,
      });
    });
  }

  startChat = this.startChat.bind(this);
  chatHistory = this.chatHistory.bind(this);
}

module.exports = { ChatController };
