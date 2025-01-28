const express = require("express");
const { createServer } = require("node:http");
const { join } = require("node:path");
const { room } = require("./routes");
const cors = require("cors");

const app = express();
const server = createServer(app);
app.use(express.json());
app.use(cors());

app.use("/", room);

server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});
