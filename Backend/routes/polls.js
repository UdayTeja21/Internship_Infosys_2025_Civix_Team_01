import express from "express";
import Poll from "../models/Poll.js";
import Vote from "../models/Vote.js";

const router = express.Router();

// ✅ Create a new Poll
router.post("/", async (req, res) => {
  console.log("📦 Poll POST body:", req.body);
  try {
    const { title, description, options, createdBy, targetLocation, closeDate } = req.body;

    if (!title || !options || options.length < 2 || !createdBy) {
        return res.status(400).json({ error: "Title, createdBy, and at least two options are required." });
    }

    const poll = new Poll({
      title,
      description,
      options: options.map((opt) => ({ text: opt, votes: 0 })), // Initialize votes at 0
      createdBy,
      targetLocation,
      closeDate,
    });

    await poll.save();
    res.status(201).json(poll);
  } catch (err) {
    console.error("Error creating poll:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get All Polls
router.get("/", async (req, res) => {
  try {
    const polls = await Poll.find().sort({ createdAt: -1 }); // Sort by newest first
    res.json(polls);
  } catch (err) {
    console.error("Error fetching polls:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get Poll IDs that a specific user has voted on
router.get("/voted", async (req, res) => {
  const { userId } = req.query;

  // ✅ VALIDATION: If userId is missing or invalid, send a clear error.
  if (!userId || userId === "undefined" || userId === "null") {
    return res.status(400).json({ error: "A valid userId query parameter is required." });
  }

  try {
    const votes = await Vote.find({ userId }).select('pollId'); // Only select the pollId field
    res.json(votes.map(v => v.pollId.toString()));
  } catch (err) {
    console.error("Error fetching voted polls:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Vote on a Poll
router.post("/:id/vote", async (req, res) => {
  try {
    const { userId, selectedOption } = req.body;
    const pollId = req.params.id;

    if (!userId || selectedOption === undefined) {
        return res.status(400).json({ error: "userId and selectedOption are required." });
    }

    const poll = await Poll.findById(pollId);
    if (!poll) {
      return res.status(404).json({ error: "Poll not found." });
    }

    const existingVote = await Vote.findOne({ pollId, userId });
    if (existingVote) {
      return res.status(400).json({ error: "You have already voted on this poll." });
    }

    const vote = new Vote({ pollId, userId, selectedOption });
    await vote.save();

    const optionIndex = typeof selectedOption === "number"
      ? selectedOption
      : poll.options.findIndex((o) => o.text === selectedOption);

    if (optionIndex < 0 || optionIndex >= poll.options.length) {
      return res.status(400).json({ error: "Invalid option selected." });
    }
    
    poll.options[optionIndex].votes += 1;
    await poll.save();

    res.json({ message: "Vote submitted successfully.", poll });
  } catch (err) {
    console.error("Error submitting vote:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Update a Poll
router.put("/:id", async (req, res) => {
  try {
    const { title, description, options, targetLocation, closeDate, status } = req.body;
    const poll = await Poll.findById(req.params.id);

    if (!poll) {
      return res.status(404).json({ error: "Poll not found." });
    }

    if (title) poll.title = title;
    if (description) poll.description = description;
    if (options && options.length > 0) {
      poll.options = options.map((opt) => ({ text: opt, votes: 0 }));
      await Vote.deleteMany({ pollId: req.params.id });
    }
    if (targetLocation) poll.targetLocation = targetLocation;
    if (closeDate) poll.closeDate = closeDate;
    if (status) poll.status = status;

    const updatedPoll = await poll.save();
    res.json({ message: "Poll updated successfully.", poll: updatedPoll });
  } catch (err) {
    console.error("Error updating poll:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Delete a Poll
router.delete("/:id", async (req, res) => {
  try {
    const poll = await Poll.findByIdAndDelete(req.params.id);
    if (!poll) {
      return res.status(404).json({ error: "Poll not found." });
    }
    await Vote.deleteMany({ pollId: req.params.id });
    res.json({ message: "Poll deleted successfully." });
  } catch (err) {
    console.error("Error deleting poll:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get Poll Results
router.get("/:id/results", async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);
    if (!poll) {
      return res.status(404).json({ error: "Poll not found." });
    }
    res.json({
      question: poll.title,
      options: poll.options.map((o) => ({
        text: o.text,
        votes: o.votes,
      })),
    });
  } catch (err) {
    console.error("Error fetching poll results:", err);
    res.status(500).json({ error: err.message });
  }
});
export default router;