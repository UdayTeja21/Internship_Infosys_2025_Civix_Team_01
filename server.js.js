// server.js
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const app = express();
app.use(express.json());
app.use(cors());

// -------------------
// 🔹 MongoDB Connection
// -------------------
mongoose
  .connect("mongodb://127.0.0.1:27017/civixDB")
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// -------------------
// 🔹 Schemas & Models
// -------------------
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["Citizen", "Public Official"], default: "Citizen" },
});

const petitionSchema = new mongoose.Schema({
  title: String,
  description: String,
  createdBy: String,
  signatures: [String], // array of user emails
});

const pollSchema = new mongoose.Schema({
  question: String,
  options: [{ option: String, votes: Number }],
  createdBy: String,
});

const notificationSchema = new mongoose.Schema({
  message: String,
  date: { type: Date, default: Date.now },
});

const engagementSchema = new mongoose.Schema({
  userId: String,
  activity: String,
  date: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);
const Petition = mongoose.model("Petition", petitionSchema);
const Poll = mongoose.model("Poll", pollSchema);
const Notification = mongoose.model("Notification", notificationSchema);
const Engagement = mongoose.model("Engagement", engagementSchema);

// -------------------
// 🔹 JWT Middleware
// -------------------
const authMiddleware = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Access Denied. No token provided." });

  try {
    const verified = jwt.verify(token, "secretKey123"); // ⚠️ use env var in prod
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid Token" });
  }
};

// -------------------
// 🔹 Auth Routes
// -------------------

// Signup
app.post("/api/signup", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, email, password: hashedPassword, role });
    await newUser.save();

    res.json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error registering user", error: err });
  }
});

// Login
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      "secretKey123",
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful",
      token,
      role: user.role,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: "Error logging in", error: err });
  }
});

// -------------------
// 🔹 Petition Routes
// -------------------
app.post("/api/petitions", authMiddleware, async (req, res) => {
  const { title, description } = req.body;
  const newPetition = new Petition({ title, description, createdBy: req.user.email, signatures: [] });
  await newPetition.save();
  res.json(newPetition);
});

app.get("/api/petitions", async (req, res) => {
  const petitions = await Petition.find();
  res.json(petitions);
});

// -------------------
// 🔹 Poll Routes
// -------------------
app.post("/api/polls", authMiddleware, async (req, res) => {
  const { question, options } = req.body;
  const newPoll = new Poll({
    question,
    options: options.map((opt) => ({ option: opt, votes: 0 })),
    createdBy: req.user.email,
  });
  await newPoll.save();
  res.json(newPoll);
});

app.get("/api/polls", async (req, res) => {
  const polls = await Poll.find();
  res.json(polls);
});

// -------------------
// 🔹 Notifications Routes
// -------------------
app.post("/api/notifications", async (req, res) => {
  const { message } = req.body;
  const newNotification = new Notification({ message });
  await newNotification.save();
  res.json(newNotification);
});

app.get("/api/notifications", async (req, res) => {
  const notifications = await Notification.find();
  res.json(notifications);
});

// -------------------
// 🔹 Engagement Routes
// -------------------
app.post("/api/engagement", async (req, res) => {
  const { userId, activity } = req.body;
  const newEngagement = new Engagement({ userId, activity });
  await newEngagement.save();
  res.json(newEngagement);
});

app.get("/api/engagement", async (req, res) => {
  const engagement = await Engagement.find();
  res.json(engagement);
});

// -------------------
// 🔹 Dashboard Summary
// -------------------
app.get("/api/dashboard/summary", async (req, res) => {
  const petitionsCount = await Petition.countDocuments();
  const pollsCount = await Poll.countDocuments();
  const notificationsCount = await Notification.countDocuments();
  const engagementCount = await Engagement.countDocuments();

  res.json({
    petitions: petitionsCount,
    polls: pollsCount,
    notifications: notificationsCount,
    engagement: engagementCount,
    responseRate: "94%", // placeholder
  });
});

// -------------------
// 🔹 Start Server
// -------------------
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
