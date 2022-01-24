const mongoCollections = require("../config/mongoCollections");
const blogs = mongoCollections.blogs;

const validations = require("./validations");
const blogData = require("./blog");
const { ObjectID } = require("bson");

async function addComment(id, comment, userThatPostedComment) {
  validations.validateId(id);
  validations.validateComment(comment, userThatPostedComment);

  let blogId = ObjectID(id);
  userThatPostedComment._id = ObjectID(userThatPostedComment._id);

  let newComment = {
    _id: new ObjectID(),
    userThatPostedComment,
    comment,
  };

  const blogCollection = await blogs();

  const addComment = await blogCollection.updateOne(
    { _id: blogId },
    { $push: { comments: newComment } }
  );

  if (!addComment) throw { code: 500, error: "Error: Cannot add comment" };

  const blog = await blogData.getBlog(blogId.toString());

  blog._id = blog._id.toString();

  return blog;
}

async function deleteComment(blogId, commentId = checkParameters()) {
  let deleteVal = {};

  validations.validateId(blogId);
  validations.validateId(commentId);

  blogId = ObjectID(blogId);
  commentId = ObjectID(commentId);

  const blogCollection = await blogs();

  const blogData = await blogCollection.updateOne(
    { _id: blogId },
    {
      $pull: { comments: { _id: commentId } },
    }
  );

  if (!(blogData.modifiedCount == 1)) {
    throw { code: 500, error: "Could not delete the comment" };
  } else {
    deleteVal["commentId"] = commentId.toString();
    deleteVal["deleted"] = true;
  }
  return deleteVal;
}

async function getComment(blogId, commentId) {
  if (!blogId) throw { code: 400, error: "Error: blogId is required" };
  if (!commentId) throw { code: 400, error: "Error: commentId is required" };

  blogId = blogId.trim();
  commentId = commentId.trim();

  validations.validateId(blogId);
  validations.validateId(commentId);

  blogId = ObjectID(blogId);
  commentId = ObjectID(commentId);

  const blogCollection = await blogs();
  const getBlog = await blogCollection.findOne({
    comments: { $elemMatch: { _id: commentId } },
  });

  if (getBlog === null) throw { code: 400, error: "No comment with that id" };
  getBlog._id = getBlog._id.toString();

  return getBlog;
}

async function validateComment(blogId, commentId, userId) {
  if (!userId) throw { code: 400, error: "Error: user Id is required" };
  if (!commentId) throw { code: 400, error: "Error: comment Id is required" };
  if (!blogId) throw { code: 400, error: "Error: Blog Id is required" };

  userId = userId.trim();
  commentId = commentId.trim();
  blogId = blogId.trim();

  validations.validateId(userId);
  validations.validateId(commentId);
  validations.validateId(blogId);

  userId = ObjectID(userId);
  commentId = ObjectID(commentId);
  blogId = ObjectID(blogId);

  const filter = {
    _id: blogId,
    comments: {
      $elemMatch: {
        _id: commentId,
      },
    },
  };

  const blogCollection = await blogs();
  const getBlog = await blogCollection.findOne(filter);

  if (getBlog === null) throw { code: 400, error: "No comment with that id" };
  getBlog._id = getBlog._id.toString();

  let flag = false;
  if (getBlog.comments != null && getBlog.comments.length >= 1) {
    for (let x of getBlog.comments) {
      if (
        x.userThatPostedComment._id.toString() == userId.toString() &&
        x._id.toString() == commentId.toString()
      ) {
        flag = true;
        break;
      }
    }
  }

  return flag;
}

module.exports = { addComment, deleteComment, getComment, validateComment };
