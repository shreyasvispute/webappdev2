const { ObjectID } = require("bson");
const mongoCollections = require("../config/mongoCollections");
const validations = require("./validations");
const blogs = mongoCollections.blogs;

async function authUser(blogid, userid) {
  let blogID = blogid;
  const blogCollection = await blogs();

  blogid = ObjectID(blogid);
  userid = ObjectID(userid);

  const result = await blogCollection.findOne({
    _id: blogid,
    "userThatPosted._id": userid,
  });
  if (result != null) {
    if (
      result._id.toString() == blogID &&
      result.userThatPosted._id.toString() == userid
    ) {
      return true;
    }
  }

  return false;
}

async function getBlogs(queryString) {
  if (queryString.take) {
    queryString.take = Number(queryString.take);
    validations.validateTake(queryString.take);
  } else {
    queryString.take = 20;
  }
  if (queryString.skip) {
    queryString.skip = Number(queryString.skip);
    validations.validateSkip(queryString.skip);
  }

  const getBlog = await blogs();
  let blogData;
  if (queryString.skip) {
    blogData = await getBlog
      .find({})
      .limit(queryString.take)
      .skip(queryString.skip)
      .toArray();
  } else {
    blogData = await getBlog.find({}).limit(queryString.take).toArray();
  }

  if (blogData === null || blogData.length === 0)
    throw { code: 400, error: "No blogs found" };

  return blogData;
}

async function getBlog(id) {
  if (!id) throw { code: 400, error: "Id is required" };
  id = id.trim();

  validations.validateId(id);
  id = ObjectID(id);

  const getBlog = await blogs();
  const blog = await getBlog.findOne({ _id: id });

  if (blog === null) throw { code: 400, error: "No blog with that id" };
  blog._id = blog._id.toString();

  return blog;
}

async function createBlog(title, body, userThatPosted) {
  title = title.trim();

  validations.validateBlog(title, body, userThatPosted);
  validations.validateId(userThatPosted._id);

  userThatPosted._id = ObjectID(userThatPosted._id);

  let newBlog = {
    title,
    body,
    userThatPosted,
    comments: [],
  };

  const blogCollection = await blogs();

  // const insertIndex = await blogCollection.createIndex(
  //   { title: 1, "userThatPosted.username": 1 },
  //   { unique: true }
  // );

  const insertBlog = await blogCollection.insertOne(newBlog);
  // .catch(function (e) {
  //   throw { code: 400, error: "Blog title already exists!" };
  // });

  if (insertBlog.insertedCount === 0)
    throw { code: 500, error: "Could not add new blog" };

  const newId = insertBlog.insertedId;

  const blog = await getBlog(newId.toString());

  blog._id = blog._id.toString();

  return blog;
}

async function updateBlog(id, title, body = checkParameters()) {
  title = title.trim();
  validations.validateId(id);
  validations.validateBlog(title, body);

  let pId = ObjectID(id);

  const blogCollection = await blogs();

  const updateBlog = {
    title: title,
    body: body,
  };

  const updateInfo = await blogCollection.updateOne(
    { _id: pId },
    { $set: updateBlog }
  );

  if (!updateInfo) throw { code: 500, error: "Could not update blog" };

  const updatedBlog = await getBlog(pId.toString());

  return updatedBlog;
}

async function updateBlogPatch(id, updateBlog) {
  validations.validateId(id);
  //validations.validateBlog(title, body);
  if (updateBlog.title) {
    updateBlog.title = updateBlog.title.trim();
    if (updateBlog.title.length == 0)
      throw { code: 400, error: "Title cannot be empty spaces" };
    if (typeof updateBlog.title != "string")
      throw { code: 400, error: "Title should be string" };
  }

  if (updateBlog.body) {
    updateBlog.body = updateBlog.body.trim();
    if (updateBlog.body == 0)
      throw { code: 400, error: "Body cannot be empty spaces" };
    if (typeof updateBlog.body != "string")
      throw { code: 400, error: "Body should be string" };
  }

  let pId = ObjectID(id);

  const blogCollection = await blogs();

  const updateInfo = await blogCollection.updateOne(
    { _id: pId },
    { $set: updateBlog }
  );

  if (!updateInfo) throw { code: 500, error: "Could not update blog" };

  const updatedBlog = await getBlog(pId.toString());

  return updatedBlog;
}

module.exports = {
  getBlogs,
  createBlog,
  updateBlog,
  getBlog,
  updateBlogPatch,
  authUser,
};
