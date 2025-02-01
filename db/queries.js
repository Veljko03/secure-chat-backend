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

    return result.rows[0];
  } catch (error) {
    console.error("Error in createNewRoomUser:", error.message);
    return { error: error.message };
  }
}

async function getMessages(serverOffset) {
  const result = await pool.query(
    "SELECT id, content, author_id, timestamp FROM messages WHERE id > $1 ORDER BY id ASC",
    [serverOffset]
  );
  console.log(result);
}

module.exports = {
  createNewMessage,
  createNewRoom,
  getRoomByUrl,
  createNewRoomUser,
  getMessages,
};
