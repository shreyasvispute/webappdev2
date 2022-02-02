const { default: axios } = require("axios");

async function getPeopleData() {
  const baseUrl =
    "https://gist.githubusercontent.com/graffixnyc/ed50954f42c3e620f7c294cf9fe772e8/raw/925e36aa8e3d60fef4b3a9d8a16bae503fe7dd82/lab2";

  const { data } = await axios.get(baseUrl);

  return data;
}
//reused from https://www.pentarem.com/blog/how-to-use-settimeout-with-async-await-in-javascript/
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getById(id) {
  if (!id) {
    throw { code: 404, error: "id is required" };
  }
  if (isNaN(Number(id))) {
    throw { code: 404, error: "id must be a number" };
  }

  let person;
  const getData = await getPeopleData();
  await delay(5000);
  if (getData) {
    person = getData.find((e) => e.id === id);
  } else {
    throw { code: 404, error: "Person not found" };
  }
  return person;
}

module.exports = {
  getById,
};
