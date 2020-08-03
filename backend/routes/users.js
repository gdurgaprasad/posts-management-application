const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const router = express.Router();

router.post("/signup", (req, res, next) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
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
        .catch(() => {
          res.status(500).json({
            message: "Account exists for the email.Please login!",
          });
        });
    })
    .catch(() => {
      res.status(500).json({
        message: "Unable to sign up now.Please try again later",
      });
    });
});

router.post("/login", (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email })
    .then((user) => {
      fetchedUser = user;
      if (!user) {
        return res.status(500).json({
          message: "Invalid email",
        });
      }
      const isPasswordVaild = bcrypt.compare(req.body.password, user.password);
      return isPasswordVaild;
    })
    .then((result) => {
      if (!result) {
        return res.status(500).json({
          message: "Invalid Password",
        });
      }
      const token = jwt.sign(
        { email: fetchedUser.email, userId: fetchedUser._id },
        "this_is_secret_key",
        { expiresIn: "1h" }
      );
      res.status(201).json({
        email: fetchedUser.email,
        userId: fetchedUser._id,
        token: token,
      });
    })
    .catch(() => {
      res.status(500).json({
        message:
          "Invalid user credentials.Please try with valid email & password.",
      });
    });
});

module.exports = router;
