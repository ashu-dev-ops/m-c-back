const express = require("express");
const router = express.Router();
const Chat = require("../models/conversation");
// new chat
router.post("/", async (req, res) => {
  const newChat = new Chat({
    members: [req.body.senderId, req.body.receiverId],
  });
  try {
    const savedChat = await newChat.save();
    console.log(savedChat);
    // neha send jhon
    //neha send baba
    res.status(200).json(savedChat);
  } catch (error) {
    res.status(500).json(error.message);
  }
});
// get user chats
router.get("/:id", async (req, res) => {
  console.log("running");
  try {
    // const chat = await Chat.findById(req.params.id);
    const chat = await Chat.find({
      // check members array inside
      members: { $in: [req.params.id] },
      //is this id exsist in members if yes then return all the memeber array that include this id
    });

    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json(error.message);
  }
});
//

router.get("/", (req, res) => {
  res.json({ msg: "working chat" });
});
module.exports = router;
