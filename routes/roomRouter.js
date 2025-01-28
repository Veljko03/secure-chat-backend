const express = require("express");
const { createRoom } = require("../controllers/roomController");
const router = express.Router();

router.get("/", (req, res) => res.send("gellooo"));
router.post("/", createRoom);

module.exports = router;
