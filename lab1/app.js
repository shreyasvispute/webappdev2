const express = require("express");
const session = require("express-session");

const app = express();

const configRoutes = require("./routes");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    name: "AuthCookie",
    secret: "619349a0e0fd477d2b352be5",
    saveUninitialized: true,
    resave: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 },
  })
);

app.use("/blog", (req, res, next) => {
  if (
    (req.method == "POST" && req.url !== "/login" && req.url != "/signup") ||
    req.method == "PUT" ||
    req.method == "PATCH" ||
    req.method == "DELETE"
  ) {
    if (!req.session.username) {
      return res.status(401).json({ error: "Please login to blog!" });
    }
  }
  next();
});

//logging middleware
app.use(function (req, res, next) {
  userStatus = !req.session.username
    ? "Non-Authenticated User"
    : "Authenticated User";
  console.log(
    "[" +
      new Date().toUTCString() +
      "]:" +
      " " +
      req.method +
      " " +
      req.originalUrl +
      " (" +
      userStatus +
      ")"
  );
  next();
});

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
