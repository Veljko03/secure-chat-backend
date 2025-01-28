const { nanoid } = require("nanoid");
const db = require("../db/queries");

const createRoom = async (req, res) => {
  //sada ovde kreirati sobu u odnosu na broj zadatih minuta od korinsika
  //koristiit nanoid za id od sobe nekako
  //url treba da bude taj id
  let { roomName, expiresIn } = req.body;

  const url = nanoid();
  console.log(url);
  console.log(req.body);

  if (!roomName || !url) {
    console.log("no room or url error");
  }
  expiresIn = parseInt(expiresIn);

  const newRoom = await db.createNewRoom(url, roomName, expiresIn);

  res.json(newRoom);
};

module.exports = { createRoom };
