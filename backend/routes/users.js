const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const router = express.Router();

router.post("/signup", (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then((hash) => {
    const user = new User({
      email: req.body.email,
      password: hash,
    });
    user
      .save()
      .then((savedUser) => {
        res.status(201).json({
          message: "user created Successfully.",
          user: savedUser,
        });
      })
      .catch((error) => {
        res.status(500).json({
          error: error,
        });
      });
  });
});

router.post("/login", (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email })
    .then((user) => {
      fetchedUser = user;
      if (!user) {
        return res.status(401).json({
          message: "Invalid email",
        });
      }
      const isPasswordVaild = bcrypt.compare(req.body.password, user.password);
      return isPasswordVaild;
    })
    .then((result) => {
      if (!result) {
        return res.status(401).json({
          message: "Invalid Password",
        });
      }
      const token = jwt.sign(
        { email: fetchedUser.email },
        "this_is_secret_key",
        { expiresIn: "1h" }
      );
      res.status(201).json({
        email: fetchedUser.email,
        userId: fetchedUser._id,
        token: token,
      });
    })
    .catch((error) => {
      res.status(401).json({
        message: "Authentication failed",
        error: error,
      });
    });
});

module.exports = router;
