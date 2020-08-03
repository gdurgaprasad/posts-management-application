const express = require("express");
const multer = require("multer");
const checkAuth = require("../middleware/check-auth");
const Post = require("../models/post");

const router = express.Router();

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("INVALID MIME TYPE");
    if (isValid) {
      error = null;
    }
    callback(error, "backend/images");
  },
  filename: (req, file, callback) => {
    const name = file.originalname.toLowerCase().split(" ").join("-");
    const extension = MIME_TYPE_MAP[file.mimetype];
    callback(null, `${name}-${Date.now()}.${extension}`);
  },
});

router.post(
  "",
  checkAuth,
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    const url = `${req.protocol}://${req.get("host")}`;
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      imagePath: `${url}/images/${req.file.filename}`,
      creator: req.userData.userId,
    });
    post
      .save()
      .then((createdPost) => {
        res.status(201).json({
          message: "post created successfully.",
          post: {
            ...createdPost,
            id: createdPost._id,
          },
        });
      })
      .catch(() => {
        res.status(500).json({
          message: "Unable to save the post.Try again later!",
        });
      });
  }
);

router.put(
  "/:postId",
  checkAuth,
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
      const url = `${req.protocol}://${req.get("host")}`;
      imagePath = `${url}/images/${req.file.filename}`;
    }
    const post = new Post({
      _id: req.body.id,
      title: req.body.title,
      content: req.body.content,
      imagePath: imagePath,
    });
    Post.updateOne({ _id: req.body.id, creator: req.userData.userId }, post)
      .then((result) => {
        if (result.n > 0) {
          res.status(201).json({
            message: "post updated successfully.",
            postId: result._id,
          });
        } else {
          res.status(500).json({
            message: "user is not authorized to update this post.",
          });
        }
      })
      .catch(() => {
        res.status(500).json({
          message: "Unable to update the post.Try again later!",
        });
      });
  }
);

router.get("", (req, res, next) => {
  const pageSize = +req.query.pageSize;
  const currentPage = +req.query.currentPage;
  let fetchedPosts;

  const postQuery = Post.find();
  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  postQuery
    .then((documents) => {
      fetchedPosts = documents;
      return Post.countDocuments();
    })
    .then((totalPostsCount) => {
      res.status(200).json({
        message: "Posts fetched successfully.",
        posts: fetchedPosts,
        totalPostsCount,
      });
    })
    .catch(() => {
      res.status(500).json({
        message: "Unable to fetch posts.Try again later!",
      });
    });
});

router.get("/:postId", (req, res, next) => {
  Post.findById(req.params.postId)
    .then((post) => {
      post
        ? res.status(200).json(post)
        : re.status(500).json({
            message: "Post not found",
          });
    })
    .catch(() => {
      res.status(500).json({
        message: "Unable to fetch the post.Try again later!",
      });
    });
});

router.delete("/:id", checkAuth, (req, res, next) => {
  Post.deleteOne({ _id: req.params.id })
    .then((deletedPost) => {
      if (deletedPost.n > 0) {
        res.status(200).json({
          message: "Post deleted successfully.",
        });
      } else {
        res.status(500).json({
          message: "User is not authorized to delete this post",
        });
      }
    })
    .catch(() => {
      res.status(500).json({
        message: "Unable to delete the post.Try again later!",
      });
    });
});

module.exports = router;
