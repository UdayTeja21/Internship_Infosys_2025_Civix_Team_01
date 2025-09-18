import express from "express";
import mongoose from "mongoose";

const router = express.Router();

// Poll Schema
const pollSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [
    {
      text: String,
      votes: { type: Number, default: 0 },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

// Register Poll model once
const Poll = mongoose.models.Poll || mongoose.model("Poll", pollSchema);

// ✅ Get all polls
router.get("/", async (req, res) => {
  try {
    const polls = await Poll.find();
    res.json(polls);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch polls" });
  }
});

// ✅ Create new poll
router.post("/", async (req, res) => {
  try {
    const { question, options } = req.body;

    if (!question || !options || !Array.isArray(options)) {
      return res.status(400).json({ error: "Invalid poll data" });
    }

    const newPoll = new Poll({
      question,
      options: options.map((opt) => ({ text: opt })),
    });

    await newPoll.save();
    res.status(201).json(newPoll);
  } catch (err) {
    res.status(500).json({ error: "Failed to create poll" });
  }
});

// ✅ Vote on a poll
router.post("/:id/vote", async (req, res) => {
  try {
    const { optionIndex } = req.body;

    const poll = await Poll.findById(req.params.id);
    if (!poll) return res.status(404).json({ error: "Poll not found" });

    if (poll.options[optionIndex]) {
      poll.options[optionIndex].votes += 1;
      await poll.save();
      res.json(poll);
    } else {
      res.status(400).json({ error: "Invalid option index" });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to vote on poll" });
  }
});

// ✅ Get poll by ID (for View Results)
router.get("/:id", async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);
    if (!poll) return res.status(404).json({ error: "Poll not found" });
    res.json(poll);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch poll" });
  }
});

// ✅ Delete poll (for Close Poll)
router.delete("/:id", async (req, res) => {
  try {
    const poll = await Poll.findByIdAndDelete(req.params.id);
    if (!poll) return res.status(404).json({ error: "Poll not found" });
    res.json({ message: "Poll closed successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to close poll" });
  }
});

export default router;
