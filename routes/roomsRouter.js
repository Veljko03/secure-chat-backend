const express = require("express");
const router = express.Router();
const roomController = require("../controllers/roomController");

router.post("/", roomController.createRoom);

router.get("/room/:url", roomController.fetchRoomByUrl);

router.post("/room/:url", roomController.addNewUserToRoom);

module.exports = router;
