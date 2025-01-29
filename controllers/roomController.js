const { nanoid } = require("nanoid");
const db = require("../db/queries");

const fetchRoomByUrl = async (req, res) => {
  const { url } = req.params;

  const room = await db.getRoomByUrl(url);
  res.json(room);
};

const createRoom = async (req, res) => {
  //sada ovde kreirati sobu u odnosu na broj zadatih minuta od korinsika
  //koristiit nanoid za id od sobe nekako
  //url treba da bude taj id
  console.log("Request body:", req.body);
  let { roomName, expiresIn } = req.body;

  const url = nanoid();

  if (!roomName || !url) {
    console.log("no room or url error");
  }
  expiresIn = parseInt(expiresIn);

  const newRoom = await db.createNewRoom(url, roomName, expiresIn);

  res.json(newRoom);
};

module.exports = { createRoom, fetchRoomByUrl };
