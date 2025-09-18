// server.js
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// ✅ Import Routes
import pollRoutes from "./routes/polls.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// -------------------
// 🔹 MongoDB Connection
// -------------------
mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/civixDB")
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
  signatures: [String],
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

// ✅ Register once
mongoose.model("User", userSchema);
mongoose.model("Petition", petitionSchema);
mongoose.model("Notification", notificationSchema);
mongoose.model("Engagement", engagementSchema);

// -------------------
// 🔹 JWT Middleware
// -------------------
const authMiddleware = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Access Denied. No token provided." });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || "secretKey123");
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
    const existingUser = await mongoose.model("User").findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new (mongoose.model("User"))({ name, email, password: hashedPassword, role });
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
    const User = mongoose.model("User");

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      process.env.JWT_SECRET || "secretKey123",
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
  const Petition = mongoose.model("Petition");
  const newPetition = new Petition({ title, description, createdBy: req.user.email, signatures: [] });
  await newPetition.save();
  res.json(newPetition);
});

app.get("/api/petitions", async (req, res) => {
  const Petition = mongoose.model("Petition");
  const petitions = await Petition.find();
  res.json(petitions);
});

// -------------------
// 🔹 Notifications Routes
// -------------------
app.post("/api/notifications", async (req, res) => {
  const { message } = req.body;
  const Notification = mongoose.model("Notification");
  const newNotification = new Notification({ message });
  await newNotification.save();
  res.json(newNotification);
});

app.get("/api/notifications", async (req, res) => {
  const Notification = mongoose.model("Notification");
  const notifications = await Notification.find();
  res.json(notifications);
});

// -------------------
// 🔹 Engagement Routes
// -------------------
app.post("/api/engagement", async (req, res) => {
  const { userId, activity } = req.body;
  const Engagement = mongoose.model("Engagement");
  const newEngagement = new Engagement({ userId, activity });
  await newEngagement.save();
  res.json(newEngagement);
});

app.get("/api/engagement", async (req, res) => {
  const Engagement = mongoose.model("Engagement");
  const engagement = await Engagement.find();
  res.json(engagement);
});

// -------------------
// 🔹 Dashboard Summary
// -------------------
app.get("/api/dashboard/summary", async (req, res) => {
  const Petition = mongoose.model("Petition");
  const Notification = mongoose.model("Notification");
  const Engagement = mongoose.model("Engagement");
  const Poll = mongoose.model("Poll"); // <-- Poll from polls.js

  const petitionsCount = await Petition.countDocuments();
  const notificationsCount = await Notification.countDocuments();
  const engagementCount = await Engagement.countDocuments();
  const pollsCount = await Poll.countDocuments();

  res.json({
    petitions: petitionsCount,
    polls: pollsCount,
    notifications: notificationsCount,
    engagement: engagementCount,
    responseRate: "94%", // placeholder
  });
});

// -------------------
// 🔹 Poll Routes
// -------------------
app.use("/api/polls", pollRoutes);

// -------------------
// 🔹 Health Check
// -------------------
app.get("/", (req, res) => {
  res.send("🚀 Civix Backend API is running...");
});

// -------------------
// 🔹 Start Server
// -------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
