const express = require("express");
const { createServer } = require("node:http");
const cors = require("cors");
const { roomRouter } = require("./routes");

const app = express();
const server = createServer(app);
app.use(cors());
app.use(express.json());

app.use("/", roomRouter);

server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});
