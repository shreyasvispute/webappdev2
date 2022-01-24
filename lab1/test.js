const connection = require("./config/mongoConnections");
const users = require("./data/users");

const main = async () => {
  try {
    const temp = await users.createUser("", "xyzz", "132456");
  } catch (error) {
    console.log(error);
  }
};
main().catch((error) => {
  console.log(error);
});
