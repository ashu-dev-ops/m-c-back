const express = require("express");
// const Product = require("../models/user");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const router = express.Router();
router.post("/update-user/:id", async (req, res) => {
  if (req.params.id) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (err) {
        return res.status(500).json(err);
      }
    }
  }
  try {
    const user = await User.findByIdAndUpdate(req.params.id, {
      $set: req.body,
    });
    res.status(200).json("Account has been updated");
  } catch (err) {
    return res.status(500).json(err);
  }
});
router.delete("/update-user/:id", async (req, res) => {
  const user = await User.findByIdAndDelete({ _id: req.params.id });
  if (!user) {
    res.json({ msg: "user not found" });
  }

  res.status(200).json({ msg: `deleted user with id of ${user.name}` });
});
router.get("/update-user/:id", async (req, res) => {
  const user = await User.findById({ _id: req.params.id });
  if (!user) {
    res.json({ msg: "user not found" });
  }
  const { name, _id, email } = user;
  const newUser = { name, id: _id, email };
  res.status(200).json(newUser);
});
router.get("/get-all/", async (req, res) => {
  const user = await User.find({});
  if (!user) {
    res.json({ msg: "user not found" });
  }

  // const { name, _id, email } = user;
  // const newUser = { name, id: _id, email };
  res.status(200).json(user);
});
module.exports = router;
