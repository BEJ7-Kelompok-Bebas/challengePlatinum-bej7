const {
  User,
  Room,
  Message,
} = require("../database/models");
const { ErrorResponse } = require("../helpers");
const { ioAuthenticator } = require("../middleware");

class ChatController {
  async startChat(socket) {
    console.log("User connected");
    //ambil user id dari header
    const { id: user_id } = ioAuthenticator(socket);

    //cari username dari user id
    const sender = await User.findOne({
      where: {
        id: user_id,
      },
      attributes: ["id", "username", "role"],
    });

    //ambil username receiver dari handshake
    const r_username = socket.handshake.query.r_username;

    //cari user receiver
    const receiver = await User.findOne({
      where: {
        username: r_username,
      },
      attributes: ["id", "username", "role"],
    });

    //cek receiver ada ato ga
    if (!receiver || receiver.role === sender.role) {
      socket.disconnect();
    }

    //cari room dengan nama gabungan
    let roomName;
    if (
      sender.role === "admin" &&
      receiver.role === "user"
    ) {
      roomName = `${r_username}${sender.username}`;
    } else {
      roomName = `${sender.username}${r_username}`;
    }

    let room = await Room.findOne({
      where: { name: roomName },
    });

    //bikin room bila tidak ada
    if (!room) {
      console.log("test1");
      room = await Room.create({ name: roomName });
    }

    const room_id = room.id;

    socket.data = {
      room_id: room_id,
      roomName: roomName,
      username: sender.username,
      id: user_id,
    };

    //join room
    socket.join(roomName);

    //cari chat history
    const messages = await Message.findAll({
      where: {
        room_id,
      },
      order: [["created_at", "ASC"]],
      include: [
        {
          model: User,
          attributes: ["id", "username"],
        },
      ],
    });

    //send history
    messages.forEach((element) => {
      socket.to(roomName).emit("chatHistory", {
        message: element.text,
        username: element.User.username,
      });
    });

    //send message
    socket.on("send", async (data) => {
      const addMessage = Message.create({
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
}

module.exports = { ChatController };
