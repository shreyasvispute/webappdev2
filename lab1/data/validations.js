const { ObjectID } = require("bson");

function validate(username, password, name) {
  if (arguments.length == 3) {
    if (typeof name != "string") {
      throw { code: 400, error: "Name must be string" };
    }
    if (name.length === 0) {
      throw { code: 400, error: "Name cannot be empty or spaces!" };
    }
    if (checkAlphanumerics(name)) {
      throw { code: 400, error: "name only accepts alphanumerics" };
    }
  }
  if (typeof username != "string" || typeof password != "string")
    throw { code: 400, error: "Username or password must be string" };
  if (username.length === 0 || username.length < 4)
    throw {
      code: 400,
      error:
        "Username cannot be empty or length should be atleast 4 chars long",
    };
  else if (/\s/.test(username))
    throw { code: 400, error: "Username cannot contain spaces" };
  if (checkAlphanumerics(username)) {
    throw { code: 400, error: "Username only accepts alphanumerics" };
  }

  if (password.trim().length === 0 || password.length < 6)
    throw {
      code: 400,
      error:
        "Password cannot be blanks or length should be atleast 6 chars long",
    };
  else if (/\s/.test(password))
    throw { code: 400, error: "Password cannot contain spaces" };
}

//check parameters validator
const checkParameters = () => {
  throw { code: 400, error: "Expected arguments not found" };
};

function checkAlphanumerics(phrase) {
  let str = phrase;
  const checker = /[^a-z0-9]/g;
  if (checker.test(str)) {
    return true;
  }
}

function validateId(id) {
  if (typeof id != "string") {
    throw { code: 400, error: "Argument of type string expected" };
  }
  if (id.trim().length === 0) {
    throw { code: 400, error: "String cannot be blanks or empty" };
  }
  if (!ObjectID.isValid(id)) {
    throw { code: 400, error: "Object Id is not valid" };
  }
}

function validateSkip(skip) {
  if (typeof skip != "number")
    throw { code: 400, error: "Argument of type string expected" };
  if (isNaN(skip)) throw { code: 400, error: "skip parameter is not a number" };

  if (skip < 1 || skip > 100) {
    throw {
      code: 400,
      error: "skip parameter can take values between 1 and 100",
    };
  }
}

function validateTake(take) {
  if (typeof take != "number")
    throw { code: 400, error: "Argument of type number expected" };
  if (isNaN(take)) throw { code: 400, error: "take parameter is not a number" };
  if (take < 1 || take > 100) {
    throw {
      code: 400,
      error: "take parameter can take values between 1 and 100",
    };
  }
}

function validateBlog(title, body, userThatPosted) {
  if (typeof title != "string") {
    throw { code: 400, error: "title must be string" };
  }
  if (title.trim().length === 0) {
    throw { code: 400, error: "title cannot be empty or spaces!" };
  }
  if (typeof body != "string") {
    throw { code: 400, error: "body must be string" };
  }
  if (body.trim().length === 0) {
    throw { code: 400, error: "body cannot be empty or spaces!" };
  }
  if (typeof userThatPosted === "object") {
    validateId(userThatPosted._id);
    if (typeof userThatPosted.username != "string") {
      throw { code: 400, error: "username must be string" };
    }
    if (userThatPosted.username.trim().length == 0) {
      throw { code: 400, error: "username cannot be empty or spaces!" };
    }
    if (Object.keys(userThatPosted).length > 2) {
      throw { code: 400, error: "userThatPosted contain only id and username" };
    }
  }
}
function validateComment(comment, userThatPostedComment) {
  if (typeof comment != "string") {
    throw { code: 400, error: "comment must be string" };
  }
  if (comment.trim().length === 0) {
    throw { code: 400, error: "comment cannot be empty or spaces!" };
  }

  if (typeof userThatPostedComment === "object") {
    validateId(userThatPostedComment._id);
    if (typeof userThatPostedComment.username != "string") {
      throw { code: 400, error: "username must be string" };
    }
    if (userThatPostedComment.username.trim().length == 0) {
      throw { code: 400, error: "username cannot be empty or spaces!" };
    }
    if (Object.keys(userThatPostedComment).length > 3) {
      throw {
        code: 400,
        error: "userThatPostedComment contain only id and username",
      };
    }
  }
}
function validateString(str) {
  if (typeof str != "string") {
    throw { code: 400, error: "parameter must be string" };
  }
  if (str.trim().length === 0) {
    throw { code: 400, error: "parameter cannot be empty or spaces!" };
  }
}
module.exports = {
  validate,
  checkParameters,
  validateBlog,
  validateSkip,
  validateId,
  validateTake,
  validateString,
  validateComment,
};
