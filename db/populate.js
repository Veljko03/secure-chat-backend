const { Client } = require("pg");
require("dotenv").config();

const SQL = `
CREATE TABLE rooms (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    url VARCHAR(255) NOT NULL UNIQUE,
    room_name TEXT NOT NULL, 
    expiration_in TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

CREATE TABLE users (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE messages ( 
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    client_offset TEXT UNIQUE,
    content TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    author_id INTEGER NOT NULL,
    room_id INTEGER NOT NULL,
    FOREIGN KEY (author_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (room_id) REFERENCES rooms (id) ON DELETE CASCADE
);

CREATE TABLE user_rooms (
    user_id INTEGER NOT NULL,
    room_id INTEGER NOT NULL,
    PRIMARY KEY (user_id, room_id),
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (room_id) REFERENCES rooms (id) ON DELETE CASCADE
);


`;

async function main() {
  console.log("seeding...");
  const client = new Client({
    //connectionString: process.env.DATABASE_URL,
    connectionString: `postgresql://${process.env.USER}:${process.env.PASSWORD}@${process.env.HOST}:${process.env.PORT}/${process.env.DATABASE}`,
  });

  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("done");
}

main();
