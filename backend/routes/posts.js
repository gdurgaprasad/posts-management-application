const express = require("express");
const Post = require("../models/post");

const router = express.Router();

router.post("", (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
  });
  post.save().then((result) => {
    res.status(201).json({
      message: "post created successfully.",
      postId: result._id,
    });
  });
});

router.put("/:postId", (req, res, next) => {
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
  });
  Post.updateOne({ _id: req.body.id }, post).then((result) => {
    res.status(201).json({
      message: "post updated successfully.",
      postId: result._id,
    });
  });
});

router.get("", (req, res, next) => {
  Post.find().then((posts) => {
    res.status(200).json({
      message: "Posts fetched successfully.",
      posts,
    });
  });
});

router.get("/:postId", (req, res, next) => {
  Post.findById(req.params.postId).then((post) => {
    post
      ? res.status(200).json(post)
      : re.status(404).json({
          message: "Post not found",
        });
  });
});

router.delete("/:id", (req, res, next) => {
  Post.deleteOne({ _id: req.params.id }).then(() => {
    res.status(200).json({
      message: "Post deleted successfully.",
    });
  });
});

module.exports = router;
