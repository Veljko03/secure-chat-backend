const pool = require("./pool");

async function getRoomByUrl(url) {
  const result = await pool.query("SELECT * FROM rooms WHERE url=$1", [url]);
  return result.rows[0];
}
async function createNewRoom(url, name, expiration_in) {
  const result = await pool.query(
    "INSERT INTO rooms (url,room_name,expiration_in) VALUES($1,$2,$3) RETURNING *",
    [url, name, expiration_in]
  );
  return result.rows[0];
}

async function createNewRoomUser(userName, roomURL) {
  try {
    let room = await pool.query("SELECT id from rooms WHERE url=$1", [roomURL]);
    if (room.rowCount === 0) {
      throw new Error("Room does not exist");
    }
    let roomID = room.rows[0].id;

    const result = await pool.query(
      "INSERT INTO users (name) VALUES($1) RETURNING *",
      [userName]
    );
    let userId = result.rows[0].id;
    console.log("user id ", userId);

    const result2 = await pool.query(
      "INSERT INTO user_rooms (user_id ,room_id) VALUES($1,$2) RETURNING *",
      [parseInt(userId), parseInt(roomID)]
    );

    return result2.rows[0];
  } catch (error) {
    console.error("Error in createNewRoomUser:", error.message);
    return { error: error.message };
  }
}

async function createNewMessage(text, userId, roomId) {
  try {
    const result = await pool.query(
      "INSERT INTO messages (content,author_id,room_id) VALUES ($1,$2,$3) RETURNING *",
      [text, userId, roomId]
    );
    const messId = result.rows[0].id;
    const withUsername = await pool.query(
      "SELECT messages.id,messages.content,messages.timestamp,users.name as userName FROM messages INNER JOIN users ON messages.author_id=users.id WHERE messages.id = $1  ORDER BY messages.id ",
      [messId]
    );

    return withUsername.rows[0];
  } catch (error) {
    console.error("Error in createNewRoomUser:", error.message);
    return { error: error.message };
  }
}

async function getMessages(serverOffset, roomId) {
  console.log(serverOffset, " offset ", roomId);

  const result = await pool.query(
    "SELECT messages.id,messages.content,messages.timestamp,users.name as userName FROM messages INNER JOIN users ON messages.author_id=users.id WHERE messages.id > $1 AND messages.room_id=$2 ORDER BY messages.id ",
    [serverOffset, roomId]
  );
  return result.rows;
}

async function deleteRoom() {
  await pool.query("DELETE FROM rooms WHERE expiration_in <= NOW()");
}

module.exports = {
  createNewMessage,
  createNewRoom,
  getRoomByUrl,
  createNewRoomUser,
  getMessages,
  deleteRoom,
};
