const express = require("express");
// const Product = require("../models/user");
const User = require("../models/user");
const router = express.Router();
router.post("/sign-up", async (req, res) => {
  console.log(req.body);
  const user = await User.create({ ...req.body });
  const token = user.createJwt();
  res.status(200).json({
    user: { user: user.name, email: user.email, userId: user._id },
    token,
  });
});
router.post("/sign-in", async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  if (!email || !password) {
    return res.json({ msg: "provide valid password and email" });
  }
  const user = await User.findOne({ email });
  if (!user) {
    // throw new UnauthenticatedError("user doesnt exsit");
    return res.json({ msg: "user doesnt exsist" });
  }
  const isPasswordCorrect = await user.comparePassword(password);
  console.log(isPasswordCorrect);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid Credentials");
  }
  const token = await user.createJwt();
  res.status(200).json({ user: { user: user.name, id: user._id }, token });

  // res.send("login");
});
module.exports = router;
