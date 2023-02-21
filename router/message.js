const express = require("express");
const router = express.Router();
const Message = require("../models/message");
const consoleError = require("./showError");


// add
router.post("/", async (req, res) => {

  console.log("\n\nRoute /message/ :-");
  console.log(`\t>> Request Body >>>>`);
  console.log(req.body);

  const newMessage = new Message(req.body);

  try {
    const saveMessage = await newMessage.save();
    res.status(200).json(saveMessage);
  } catch (error) {
    consoleError(error);
    res.status(500).json(error.message);
  }

});


// get
router.get("/:chatId", async (req, res) => {

  console.log("\n\nRoute /chat/:chatId :-");
  console.log(`\t>> Request Parameters >>>>`);
  console.log(req.params);

  try {
    const messages = await Message.find({
      chatId: req.params.chatId,
    });

    res.status(200).json(messages);
    
  } catch (err) {
    consoleError(err);
    res.status(500).json(err.message);
  }
});


module.exports = router;
