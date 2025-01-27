const express = require("express");
const { createServer } = require("node:http");
const { join } = require("node:path");
const { room } = require("./routes");

const app = express();
const server = createServer(app);
app.use("/", room);

server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});
