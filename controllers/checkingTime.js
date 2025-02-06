const cron = require("node-cron");
const db = require("../db/queries");
console.log("Aaaaaaaaa");

cron.schedule("*/1 * * * *", async () => {
  try {
    const cuttTime = Date.now();
    console.log("sekund");

    await db.deleteRoom();
  } catch (error) {
    console.log(error, "error");
  }
});
