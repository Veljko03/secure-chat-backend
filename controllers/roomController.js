const { nanoid } = require("nanoid");

const createRoom = async (req, res) => {
  //sada ovde kreirati sobu u odnosu na broj zadatih minuta od korinsika
  //koristiit nanoid za id od sobe nekako
  //url treba da bude taj id
  console.log(req.body);
};

module.exports = { createRoom };
