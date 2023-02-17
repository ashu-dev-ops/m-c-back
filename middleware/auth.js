const User = require("../models/user");
const jwt = require("jsonwebtoken");
// const { UnauthenticatedError } = require("../errors");
const auth = async (req, res, next) => {
  // check header
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.json({ msg: "header not present" });
  }
  const token = authHeader.split(" ")[2];
  // res.json(token);

  try {
    const payload = jwt.verify(token, "12345");
    // we are adding this to user property to req obj
    req.user = { userId: payload.userId, name: payload.name };
    console.log(req.user);
    // we can access this user in our jobs controller
    // another way of getting user
    // const user = User.findById(payload.UserId).select("-password");

    // req.user = user;
    next(); //we are going to access these in our jobs controller , specifically use id
  } catch (error) {
    // throw new UnauthenticatedError("invalid credentials");
    res.json({ msg: error });
  }
};
module.exports = auth;
