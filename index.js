const server = require("./app");
require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
});

const port = process.env.PORT;

server.listen(port, () => {
  console.log(`Server is listening to ${port}`);
});
