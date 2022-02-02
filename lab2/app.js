// const data = require("./data/peopleData");
// const redis = require("redis");

// (async () => {
//   const client = redis.createClient();
//   console.log(data);
//   client.on("error", (err) => console.log("Redis Client Error", err));

//   await client.connect();

//   await client.set("key", "value");
//   const value = await client.get("key");
//   console.log(value);
// })();
const express = require("express");
const app = express();

const configRoutes = require("./routes");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
