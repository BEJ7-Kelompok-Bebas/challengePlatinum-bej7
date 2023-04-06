const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/user.routes");
const itemRouter = require("./routes/item.routes");
const orderRouter = require("./routes/order.routes");

//swagger
const swaggerUI = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDoc = YAML.load("./swagger.yaml");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/user", userRouter);
app.use("/api/v1/item", itemRouter);
app.use("/api/v1/order", orderRouter);

//serve swagger
app.use(
  "/docs-api",
  swaggerUI.serve,
  swaggerUI.setup(swaggerDoc),
);
app.get("/", (req, res) => {
  res.send(
    '<h1>Challenge API</h1><a href="/docs-api">Documentation</a>',
  );
});

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
