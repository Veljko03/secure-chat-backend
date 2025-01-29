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

module.exports = { createNewRoom, getRoomByUrl };
