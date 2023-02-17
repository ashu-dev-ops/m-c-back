const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "please provide username"],
    minlength: 3,
    maxlength: 30,
  },
  email: {
    type: String,
    required: [true, "Please provide email"],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please provide a valid email",
    ],
    unique: true,
  },

  password: {
    type: String,
    required: [true, "please provide password"],
    minlength: 3,
    maxlength: 80,
  },
  pic: String,
});
UserSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
UserSchema.methods.createJwt = function () {
  // console.log("hi");
  // return jwt.sign({ userId: this._id, name: this.name }, "jwt", {
  //   return jwt.sign({ userId: this._id, name: this.name }, process.env.JWT_SECRET, {
  return jwt.sign({ userId: this._id, name: this.name }, "12345", {
    expiresIn: "30d",
  });
};
UserSchema.methods.comparePassword = async function (canditatePassword) {
  const isMatch = await bcrypt.compare(canditatePassword, this.password);
  return isMatch;
};

module.exports = mongoose.model("User", UserSchema);
