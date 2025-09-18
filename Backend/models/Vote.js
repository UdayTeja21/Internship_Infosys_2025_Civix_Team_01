 // models/Vote.js
import mongoose from "mongoose";

const voteSchema = new mongoose.Schema(
  {
    pollId: { type: mongoose.Schema.Types.ObjectId, ref: "Poll", required: true },
    userId: { type: String, required: true },
    selectedOption: { type: String, required: true },
  },
  { timestamps: true }
);

// prevent duplicate votes (unique pollId+userId combo)
voteSchema.index({ pollId: 1, userId: 1 }, { unique: true });

const Vote = mongoose.model("Vote", voteSchema);

export default Vote;
