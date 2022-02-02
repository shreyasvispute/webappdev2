const peopleRoutes = require("./peopleRoutes");

const constructorMethod = (app) => {
  app.use("/api", peopleRoutes);

  app.use("*", (req, res) => {
    res.status(404).json({ error: "Path Not Found" });
  });
};

module.exports = constructorMethod;
