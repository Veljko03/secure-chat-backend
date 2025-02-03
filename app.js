const express = require("express");
const { createServer } = require("node:http");
const cors = require("cors");
const { roomRouter } = require("./routes");
const { Server } = require("socket.io");
const db = require("./db/queries");

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

app.use(cors());
app.use(express.json());

app.use("/", roomRouter);

io.on("connection", async (socket) => {
  socket.on("chat-message", async (msg) => {
    let result;

    try {
      // store the message in the database
      result = await db.createNewMessage(msg.text, msg.userId, msg.roomId);
    } catch (e) {
      console.log(e);

      return;
    }

    io.emit("chat-message", msg, result.id);
  });
  if (!socket.recovered) {
    // if the connection state recovery was not successful
    try {
      const serverOffset = socket.handshake.auth.serverOffset || 0;
      const roomId = socket.handshake.auth.roomId;
      const result = await db.getMessages(serverOffset, roomId);

      console.log(result, " result");

      result.forEach((row) => {
        socket.emit("chat-message", row);
      });
      // result.rows.forEach((row) => {
      //   socket.emit("chat-message", {
      //     id: row.id,
      //     text: row.content,
      //     user: row.author_id,
      //     timestamp: row.timestamp,
      //   });
      // });
    } catch (e) {
      // something went wrong
    }
  }
});

server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});
