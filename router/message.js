const express = require("express");
const router = express.Router();
const Message = require("../models/message");
// add
router.post("/", async (req, res) => {
  const newMessage = new Message(req.body);
  try {
    const saveMessage = await newMessage.save();
    res.status(200).json(saveMessage);
  } catch (error) {
    res.status(500).json(error);
  }
});
// get
router.get("/:chatId", async (req, res) => {
  try {
    const messages = await Message.find({
      chatId: req.params.chatId,
    });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json(err);
  }
});
module.exports = router;
