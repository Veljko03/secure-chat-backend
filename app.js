const express = require("express");
const { createServer } = require("node:http");
const cors = require("cors");
const { roomRouter } = require("./routes");
const { Server } = require("socket.io");
const db = require("./db/queries");
require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });

console.log(process.env.FRONTEND_URL);

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
  },
});

require("./controllers/checkingTime");
app.use(cors());
app.use(express.json());

app.use("/", roomRouter);

io.on("connection", async (socket) => {
  const roomId = socket.handshake.auth.roomId;

  if (roomId) {
    socket.join(roomId);
    console.log(`User joined room ${roomId}`);
  }
  socket.on("chat-message", async (msg) => {
    let result;

    try {
      // store the message in the database
      result = await db.createNewMessage(
        msg.text,
        msg.userId,
        msg.roomId,
        msg.iv
      );
    } catch (e) {
      console.log(e);

      return;
    }
    console.log("emmitovao ", result);

    io.to(roomId).emit("chat-message", result, result.id);
  });
  if (!socket.recovered) {
    // if the connection state recovery was not successful
    if (roomId) {
      try {
        const serverOffset = socket.handshake.auth.serverOffset || 0;
        const result = await db.getMessages(serverOffset, roomId);
        console.log("id sove ", roomId);
        console.log(result);

        result.forEach((row) => {
          socket.emit("chat-message", row, row.id);
        });
      } catch (e) {
        // something went wrong
      }
    }
  }
});

server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});
