// setting up a model
const mongoose = require("mongoose"); //first import mongoose
const chatSchema = new mongoose.Schema(
  {
    members: {
      type: Array,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Chat", chatSchema);
