const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/user.routes");
const itemRouter = require("./routes/item.routes");
const orderRouter = require("./routes/order.routes");
const cors = require("cors");

//Swagger
const swaggerUI = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocs = YAML.load("./swagger.yml");

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use("/api/v1/user", userRouter);
app.use("/api/v1/item", itemRouter);
app.use("/api/v1/order", orderRouter);

app.use(
  "/api-docs",
  swaggerUI.serve,
  swaggerUI.setup(swaggerDocs),
);

app.use((err, req, res, next) => {
  console.log(err);

  const status = err.code || 500;
  const error =
    err.error || err.message || "Internal server error";

  return res.status(status).json({
    code: status,
    error: error,
    data: {},
  });
});

const server = http.createServer(app);
const io = socketio(server);
const { chatRoute } = require("./routes/chat.routes");

chatRoute(io);

module.exports = server;
