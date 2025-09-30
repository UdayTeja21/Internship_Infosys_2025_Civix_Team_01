
// import mongoose from "mongoose";

// const PollSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   description: { type: String },
//   options: [
//     {
//       text: { type: String, required: true },
//       votes: { type: Number, default: 0 },
//     },
//   ],
//   createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//   targetLocation: { type: String },
//   closeDate: { type: Date },
//   status: { type: String, enum: ["active", "closed"], default: "active" },
//   createdAt: { type: Date, default: Date.now },
// });

// const Poll = mongoose.model("Poll", PollSchema);

// export default Poll;




// import mongoose from "mongoose";

// const PollSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   description: { type: String },
//   options: [
//     {
//       text: { type: String, required: true },
//       votes: { type: Number, default: 0 },
//     },
//   ],
//   createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//   targetLocation: { type: String },
//   closeDate: { type: Date },
//   status: { type: String, enum: ["active", "closed"], default: "active" },
//   createdAt: { type: Date, default: Date.now },
// });

// const Poll = mongoose.model("Poll", PollSchema);

// export default Poll;




import mongoose from "mongoose";

const PollSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  options: [
    {
      text: { type: String, required: true },
      votes: { type: Number, default: 0 },
    },
  ],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  targetLocation: { type: String },
  closeDate: { type: Date },
  status: { type: String, enum: ["active", "closed"], default: "active" },
  createdAt: { type: Date, default: Date.now },
  isOfficial: { type: Boolean, default: false }
});

const Poll = mongoose.model("Poll", PollSchema);

export default Poll;