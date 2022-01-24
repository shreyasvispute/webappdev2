const mongoCollections = require("../config/mongoCollections");
const validations = require("../data/validations");
const bcrypt = require("bcrypt");
const users = mongoCollections.users;

const salt = 1;

async function createUser(name, username, password = checkParameters()) {
  name = name.trim();
  username = username.trim();
  password = password.trim();
  name = name.toLowerCase();
  username = username.toLowerCase();

  validations.validate(username, password, name);

  let result = {};
  const hashedPassword = await bcrypt.hash(password, salt).catch(function (e) {
    throw { code: 500, error: "Error while hashing!" };
  });

  let loginInfo = {
    name,
    username,
    password: hashedPassword,
  };

  const usersCollection = await users().catch(function (e) {
    throw { code: 500, error: "Internal Server Error" };
  });

  const uniqueIndex = await usersCollection.createIndex(
    { username: 1 },
    { unique: true }
  );

  const addUser = await usersCollection
    .insertOne(loginInfo)
    .catch(function (e) {
      throw { code: 400, error: "Username already exists" };
    });

  let user;
  if (addUser.insertedInfo === 0) {
    throw {
      code: 500,
      error: "Internal Server Error: error while adding new user",
    };
  } else {
    user = await getUser(addUser.insertedId);
  }
  // user.userInserted = true;

  return user;
}

async function checkUser(username, password = checkParameters()) {
  username = username.trim();
  password = password.trim();
  let uname = username.toLowerCase();

  validations.validate(username, password);

  let result = {};

  const userCollection = await users();
  const checkData = await userCollection.findOne({ username: uname });

  if (checkData === null) throw { code: 404, error: "User not found" };

  const comparePasswords = await bcrypt
    .compare(password, checkData.password)
    .catch(function (e) {
      throw { code: 500, error: "Error while comparing hashes " };
    });

  if (!comparePasswords) {
    throw { code: 400, error: "Either the username or password is invalid" };
  }
  delete checkData.password;
  return checkData;
}

async function getUser(id) {
  const userCollection = await users();
  const checkData = await userCollection.findOne({ _id: id });

  if (checkData === null) throw { code: 404, error: "No record found" };
  checkData._id = checkData._id.toString();
  delete checkData.password;
  return checkData;
}

module.exports = {
  createUser,
  checkUser,
};
