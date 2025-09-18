 // models/Poll.js
import mongoose from "mongoose";

const pollSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  options: [
    {
      text: String,
      votes: { type: Number, default: 0 },
    },
  ],
  createdBy: { type: String, required: true }, // user id
  targetLocation: String,
  closeDate: Date,
  status: { type: String, default: "active" }, // active/closed
});

const Poll = mongoose.model("Poll", pollSchema);

export default Poll;
