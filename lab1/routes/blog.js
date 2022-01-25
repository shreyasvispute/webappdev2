const express = require("express");
const router = express.Router();
const data = require("../data");
const validations = require("../data/validations");
const blogData = data.blogs;
const userData = data.users;
const commentsData = data.comments;

//middlewares
const authorizeUserBlogAccess = async (req, res, next) => {
  if (!req.params.id) return res.status(400).json({ error: "Id is required" });
  try {
    validations.validateId(req.params.id);

    const validateBlog = await blogData.getBlog(req.params.id);
    if (!validateBlog) return res.status(404).json({ error: "Blog not found" });

    const authUser = await blogData.authUser(req.params.id, req.session.userId);
    if (!authUser)
      return res.status(403).json({ error: "Unauthorized access" });
  } catch (e) {
    if (e.code) {
      return res.status(e.code).json({ error: e.error });
    }
    res.status(500).json({ error: "Internal Server Error: " + e });
  }

  next();
};

const authorizeUserCommentAccess = async (req, res, next) => {
  if (!req.params.blogId)
    return res.status(400).json({ error: "Blog Id is required" });
  if (!req.params.commentId)
    return res.status(400).json({ error: "Comment Id is required" });
  try {
    validations.validateId(req.params.blogId);
    validations.validateId(req.params.commentId);

    const authUser = await commentsData.validateComment(
      req.params.blogId,
      req.params.commentId,
      req.session.userId
    );
    if (!authUser)
      return res.status(403).json({ error: "Unauthorized access" });
  } catch (e) {
    if (e.code) {
      return res.status(e.code).json({ error: e.error });
    }
    res.status(500).json({ error: "Internal Server Error: " + e });
  }

  next();
};

//users routes
router.post("/signup", async (req, res) => {
  let name = req.body.name;
  let username = req.body.username;
  let password = req.body.password;

  if (!name) {
    res.status(400).json({
      error: "Name is required",
    });
    return;
  }

  if (!username) {
    res.status(400).json({
      error: "Username is required",
    });
    return;
  }

  if (!password) {
    res.status(400).json({
      error: "Password is required",
    });
    return;
  }

  name = name.toLowerCase();
  username = username.toLowerCase();

  try {
    validations.validate(username, password, name);

    const validateUser = await userData.createUser(name, username, password);
    if (validateUser) {
      res.json(validateUser);
      return;
    }
  } catch (e) {
    res.status(e.code).json({ error: e.error });
  }
});

router.post("/login", async (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  if (!username) {
    res.status(400).render({
      error: "Username is required",
    });
    return;
  }
  if (!password) {
    res.status(400).json({
      error: "Password is required",
    });
    return;
  }

  username = username.toLowerCase();

  if (req.session.username == username) {
    res.json({ message: "User already logged in" });
    return;
  }

  try {
    validations.validate(username, password);

    const validateUser = await userData.checkUser(username, password);
    if (validateUser) {
      req.session.username = username;
      req.session.userId = validateUser._id;
      res.json(validateUser);
    }
  } catch (e) {
    if (e.code) {
      res.status(e.code).json({ error: e.error });
      return;
    }
    res.status(500).json({ error: "Internal Server Error: " + e });
  }
});

router.get("/logout", async (req, res) => {
  try {
    let user = req.session.username;

    if (!user) {
      res.json({ message: "No user logged in" });
      return;
    }
    req.session.destroy();
    res.json({ message: "Logged out successfully for: " + user });
  } catch (error) {
    res.status(404).json({ error: "Page not found" });
  }
});

//blog routes
router.get("/:id", async (req, res) => {
  if (!req.params.id)
    return res.status(400).json({ error: "Blog Id is required" });

  try {
    validations.validateId(req.params.id);
    let getBlogs = await blogData.getBlog(req.params.id);
    res.json(getBlogs);
  } catch (e) {
    if (e.code) {
      res.status(e.code).json({ error: e.error });
      return;
    }
    res.status(500).json({ error: "Internal Server Error: " + e });
  }
});

router.get("/", async (req, res) => {
  let queryString = {};
  let take, skip;

  try {
    if (req.query.skip && req.query.skip != "") {
      skip = Number(req.query.skip);
      validations.validateSkip(skip);
      queryString.skip = skip;
    }
    if (req.query.take && req.query.take != "") {
      take = Number(req.query.take);
      validations.validateTake(take);
      queryString.take = take;
    } else {
      queryString.take = 20;
    }

    let getBlogs = await blogData.getBlogs(queryString);

    res.json(getBlogs);
  } catch (e) {
    if (e.code) {
      res.status(e.code).json({ error: e.error });
      return;
    }
    res.status(500).json({ error: "Internal Server Error: " + e });
  }
});

router.post("/", async (req, res) => {
  let title = req.body.title;
  let body = req.body.body;

  if (!title) {
    res.status(400).json({
      error: "Name is required",
    });
    return;
  }
  if (!body) {
    res.status(400).json({
      error: "Body is required",
    });
    return;
  }

  title = title.trim();
  let userThatPosted = {
    _id: req.session.userId,
    username: req.session.username,
  };

  try {
    validations.validateBlog(title, body, userThatPosted);

    const createBlog = await blogData.createBlog(title, body, userThatPosted);
    if (createBlog) {
      res.json(createBlog);
      return;
    }
  } catch (e) {
    if (e.code) {
      res.status(e.code).json({ error: e.error });
      return;
    }
    res.status(500).json({ error: "Internal Server Error: " + e });
  }
});

router.put("/:id", authorizeUserBlogAccess, async (req, res) => {
  if (!req.params.id) return res.status(400).json({ error: "Id is required" });

  let userThatPosted = {
    _id: req.session.userId,
    username: req.session.username,
  };

  let title = req.body.title;
  let body = req.body.body;

  if (!title) {
    res.status(400).json({
      error: "Title is required",
    });
    return;
  }
  if (!body) {
    res.status(400).json({
      error: "Body is required",
    });
    return;
  }

  title = title.trim();
  body = body.trim();

  try {
    validations.validateId(req.params.id);
    validations.validateBlog(title, body, userThatPosted);

    const updateBlog = await blogData.updateBlog(req.params.id, title, body);
    if (updateBlog) {
      res.json(updateBlog);
      return;
    }
  } catch (e) {
    if (e.code) {
      res.status(e.code).json({ error: e.error });
      return;
    }
    res.status(500).json({ error: "Internal Server Error: " + e });
  }
});

router.patch("/:id", authorizeUserBlogAccess, async (req, res) => {
  if (!req.params.id) return res.status(400).json({ error: "Id is a must" });

  try {
    let updateBlog = {};
    validations.validateId(req.params.id);

    const validateBlog = await blogData.getBlog(req.params.id);
    if (!validateBlog) return res.status(404).json({ error: "Blog not found" });

    if (req.body.title && req.body.title !== validateBlog.title) {
      validations.validateString(req.body.title);
      updateBlog.title = req.body.title;
    }
    if (req.body.body && req.body.body !== validateBlog.body) {
      validations.validateString(req.body.body);
      updateBlog.body = req.body.body;
    }

    if (Object.keys(updateBlog).length !== 0) {
      try {
        const updateResult = await blogData.updateBlogPatch(
          req.params.id,
          updateBlog
        );
        if (updateResult) {
          res.json(updateResult);
        }
      } catch (e) {
        res.status(e.code).json({ error: e.error });
      }
    } else {
      res.status(400).json({ error: "No fields changed" });
    }
  } catch (e) {
    if (e.code) {
      res.status(e.code).json({ error: e.error });
      return;
    }
    res.status(500).json({ error: "Internal Server Error: " + e });
  }
});

//comments routes
router.post("/:id/comments", async (req, res) => {
  if (!req.params.id) return res.status(400).json({ error: "Id is a must" });

  let comment = req.body.comment;

  if (!comment) {
    res.status(400).json({
      error: "Comment is required",
    });
    return;
  }

  comment = comment.trim();
  let userThatPostedComment = {
    _id: req.session.userId,
    username: req.session.username,
  };

  try {
    validations.validateComment(comment, userThatPostedComment);

    const addComment = await commentsData.addComment(
      req.params.id,
      comment,
      userThatPostedComment
    );

    if (addComment) {
      res.json(addComment);
    }
  } catch (e) {
    if (e.code) {
      res.status(e.code).json({ error: e.error });
      return;
    }
    res.status(500).json({ error: "Internal Server Error: " + e });
  }
});

router.delete(
  "/:blogId/:commentId",
  authorizeUserCommentAccess,
  async (req, res) => {
    if (!req.params.blogId) {
      res.status(400).json({ error: "You must Supply a Blog id to delete" });
      return;
    }
    if (!req.params.commentId) {
      res.status(400).json({ error: "You must Supply a Comment Id to delete" });
      return;
    }

    try {
      validations.validateId(req.params.blogId);
      validations.validateId(req.params.commentId);

      await commentsData.getComment(req.params.blogId, req.params.commentId);
    } catch (e) {
      res.status(404).json({ error: "Comment not found" });
      return;
    }

    try {
      const result = await commentsData.deleteComment(
        req.params.blogId,
        req.params.commentId
      );
      res.json(result);
    } catch (e) {
      if (e.code) {
        res.status(e.code).json({ error: e.error });
        return;
      }
      res.status(500).json({ error: "Internal Server Error: " + e });
    }
  }
);

module.exports = router;
