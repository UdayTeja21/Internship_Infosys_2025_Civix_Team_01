import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";

// Middleware & Models
import authMiddleware from "./middleware/authMiddleware.js";

// Routes
import User from "./models/User.js";
import authRoutes from "./routes/auth.js";
import dashboardRoutes from "./routes/dashboard.js";
import officialsRoutes from "./routes/officials.js";
import petitionRoutes from "./routes/petitions.js";
import pollRoutes from "./routes/Polls.js";
import reportRoutes from './routes/reports.js';
import settingsRoutes from "./routes/settings.js";
dotenv.config();
const app = express();

// Middleware Setup
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));


// API Routes
// NOTE: It's best practice to move all route logic into the /routes folder.
// For now, the authMiddleware has been fixed.
app.use("/api/auth", authRoutes);
app.use("/api/petitions", petitionRoutes);
app.use("/api/polls", pollRoutes);
app.use("/api/settings", settingsRoutes);
app.use('/api/dashboard', authMiddleware, dashboardRoutes); // Protected dashboard routes
app.use('/api/officials', authMiddleware, officialsRoutes);
app.use('/api', reportRoutes); 

// =================================================================
// DELETED: The duplicate 'authMiddleware' function was removed from here.
// It is correctly imported from './middleware/authMiddleware.js' at the top of the file.
// =================================================================

// Helper to normalize category input
const normalizeCategory = (category) => {
  if (!category) return null;
  const lower = category.toLowerCase().trim();
  const categoryMap = {
    'environment': 'environment', 'infrastructure': 'infrastructure',
    'education': 'education', 'public safety': 'public-safety',
    'public-safety': 'public-safety', 'transportation': 'transportation',
    'healthcare': 'healthcare', 'housing': 'housing',
    'government': 'government', 'community': 'community',
    'other': 'other'
  };
  return categoryMap[lower] || null;
};

// ========================
// Direct API Routes (Consider moving to /routes)
// ========================
app.get("/api/auth/me", authMiddleware, (req, res) => res.json({ user: req.user }));
app.get("/api/debug/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// It seems you've moved petition routes to a separate file.
// If these routes below are still needed here, they might conflict with `petitionRoutes`.
// For now, I'm assuming they should be removed if they exist in `/routes/petitions.js`.
// If not, they should be moved there for better organization.

// ========================
// Health Check and Server Start
// ========================
app.get("/", (req, res) => res.json({ message: "🚀 Server running", time: new Date().toISOString() }));
app.get("/api/health", (req, res) => res.json({ status: "OK", db: mongoose.connection.readyState === 1 ? "connected" : "disconnected" }));

mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/petitionapp")
  .then(() => {
    app.listen(process.env.PORT || 5000, () => console.log(`🚀 Server running on port ${process.env.PORT || 5000}`));
  })
  .catch(err => { console.error("MongoDB error:", err); process.exit(1); });

export default app;