import mongoose from "mongoose";

const VoteSchema = new mongoose.Schema({
  pollId: { type: mongoose.Schema.Types.ObjectId, ref: "Poll", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  selectedOption: { type: String, required: true },
  votedAt: { type: Date, default: Date.now },
});

// Prevent duplicate voting
VoteSchema.index({ pollId: 1, userId: 1 }, { unique: true });

const Vote = mongoose.model("Vote", VoteSchema);

export default Vote;