const express = require("express");
const router = express.Router();
const Chat = require("../models/conversation");
const consoleError = require("./showError");

// new chat
router.post("/", async (req, res) => {
  console.log("\n\nRoute /chat/ :-");
  console.log(`\t>> Request Body >>>>`);
  console.log(req.body);

  const newChat = new Chat({
    members: [req.body.senderId, req.body.receiverId],
  });

  try {
    const savedChat = await newChat.save();
    res.status(200).json(savedChat);
  } catch (error) {
    consoleError(error);
    res.status(500).json(error.message);
  }
});

// get user chats
router.get("/:id", async (req, res) => {
  console.log("\n\nRoute /chat/:id/ :-");
  console.log(`\t>> Request Parameters >>>>`);
  console.log(req.params);

  try {
    const chat = await Chat.find({
      // check members array inside
      members: { $in: [req.params.id] },
      //is this id exsist in members if yes then return all the memeber array that include this id
    });

    res.status(200).json(chat);
  } catch (error) {
    consoleError(error);
    res.status(500).json(error.message);
  }
});

router.get("/", (req, res) => {
  res.json({ msg: "working chat" });
});

module.exports = router;
