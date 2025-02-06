const { nanoid } = require("nanoid");
const db = require("../db/queries");

const fetchRoomByUrl = async (req, res) => {
  const { url } = req.params;

  const room = await db.getRoomByUrl(url);
  res.json(room);
};

const createRoom = async (req, res) => {
  let { roomName, expiresIn } = req.body;

  const url = nanoid();

  if (!roomName || !url) {
    console.log("no room or url error");
  }
  expiresIn = parseInt(expiresIn);
  const expiresTime = new Date(Date.now() + expiresIn * 60 * 60 * 1000);

  const newRoom = await db.createNewRoom(url, roomName, expiresTime);

  res.json(newRoom);
};

const addNewUserToRoom = async (req, res) => {
  const { userName } = req.body;
  const { url } = req.params;
  console.log("usao");

  const createRoomUser = await db.createNewRoomUser(userName, url);

  res.json(createRoomUser);
};

module.exports = { createRoom, fetchRoomByUrl, addNewUserToRoom };
