const express = require("express");
const router = express.Router();
const peopleData = require("../data/peopleData");
const redis = require("redis");
const client = redis.createClient();

(async () => {
  client.on("error", (err) => console.log("Redis Client Error", err));

  await client.connect();
  await client.flushAll();
})();

router.get("/people/history", async (req, res) => {
  try {
    const cacheHistory = await client.lRange("cacheHistory", 0, 20);
    let history = [];
    cacheHistory.forEach((x) => {
      let y = JSON.parse(x);
      history.push(y);
    });
    return res.json(history);
  } catch (error) {
    res.status(404).json({ message: "Page not found" + error });
  }
});

router.get("/people/:id", async (req, res) => {
  if (!req.params.id) {
    res.status(400).json({
      error: "id cannot be empty",
    });
    return;
  } else if (isNaN(Number(req.params.id))) {
    res.status(400).json({
      error: "Expected parameter of type number",
    });
    return;
  } else if (req.params.id.trim().length == 0) {
    res.status(400).json({
      error: "id cannot be empty spaces",
    });
    return;
  }

  try {
    let cachedPerson = await client.hGet("redisCache", req.params.id);
    if (cachedPerson) {
      let cacheHistory = await client.lPush("cacheHistory", cachedPerson);
      return res.json(JSON.parse(cachedPerson));
    } else {
      const person = await peopleData.getById(Number(req.params.id));
      let personToBeCached = await client.hSet(
        "redisCache",
        req.params.id,
        JSON.stringify(person)
      );
      let cacheHistory = await client.lPush(
        "cacheHistory",
        JSON.stringify(person)
      );
      res.json(person);
    }
  } catch (error) {
    if (error.code) {
      res.status(error.code).json({ error: error.error });
      return;
    }
    res.status(404).json({ error: "person not found" });
  }
});

module.exports = router;
