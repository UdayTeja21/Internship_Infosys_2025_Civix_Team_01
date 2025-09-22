import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";

// Middleware & Models
import authMiddleware from "./middleware/authMiddleware.js";

// Routes
import authRoutes from "./routes/auth.js";
import dashboardRoutes from "./routes/dashboard.js";
import petitionRoutes from "./routes/petitions.js";
import pollRoutes from "./routes/polls.js";
import settingsRoutes from "./routes/settings.js";

dotenv.config();
const app = express();

// Middleware Setup
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
}));
app.use(express.json());

// API Routes
// NOTE: It's best practice to move all route logic into the /routes folder.
// For now, the authMiddleware has been fixed.
app.use("/api/auth", authRoutes);
app.use("/api/petitions", petitionRoutes);
app.use("/api/polls", pollRoutes);
app.use("/api/settings", settingsRoutes);
app.use('/api/dashboard', authMiddleware, dashboardRoutes); // Protected dashboard routes

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

// // ========================
// // Schemas & Models
// // ========================
// const pollSchema = new mongoose.Schema({
//   question: { type: String, required: true },
//   options: [{ option: String, votes: { type: Number, default: 0 } }],
//   createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
// });
// const Poll = mongoose.model("Poll", pollSchema);

// const notificationSchema = new mongoose.Schema({
//   message: { type: String, required: true },
//   date: { type: Date, default: Date.now },
// });
// const Notification = mongoose.model("Notification", notificationSchema);

// const engagementSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//   activity: { type: String, required: true },
//   date: { type: Date, default: Date.now },
// });
// const Engagement = mongoose.model("Engagement", engagementSchema);

// ========================
// Auth Routes
// ========================

// app.post("/api/auth/signup", async (req, res) => {
//   try {
//     const { fullName, email, password, role } = req.body;
//     if (!fullName || !email || !password) return res.status(400).json({ message: "All fields are required" });

//     const existingUser = await User.findOne({ email });
//     if (existingUser) return res.status(400).json({ message: "User already exists" });

//     // FIX: Removed password hashing here. The User model's pre('save') hook handles it.
//     const user = new User({ fullName, email, password, role: (role || "citizen").toLowerCase() });
//     await user.save();

//     const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: "7d" });

//     res.status(201).json({ token, user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role } });
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// });

// app.post("/api/auth/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ message: "Invalid credentials" });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

//     const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: "7d" });

//     res.json({ message: "Login successful", user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role }, token });
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// });

app.get("/api/auth/me", authMiddleware, (req, res) => res.json({ user: req.user }));
app.use("/api/auth", authRoutes);
// ========================
// Petition Routes
// ========================

// Get all petitions
app.get("/api/petitions", async (req, res) => {
  try {
    const { category, location, status, search, page = 1, limit = 1000, userId } = req.query;
    let query = {};
    if (category && category !== 'all') {
      const norm = normalizeCategory(category);
      if (norm) query.category = norm;
    }
    if (location && location !== 'all') query.location = new RegExp(location, 'i');
    if (status && status !== 'all') query.status = status;
    if (search) query.$or = [{ title: new RegExp(search, 'i') }, { description: new RegExp(search, 'i') }];

    const petitions = await Petition.find(query).populate('creator', 'fullName email').sort({ createdAt: -1 }).limit(limit * 1).skip((page - 1) * limit);

    let enhanced = petitions;
    if (userId) {
      enhanced = petitions.map(p => {
        const obj = p.toObject();
        obj.hasSigned = p.signatures.some(sig => sig.user.equals(userId));
        obj.isMyPetition = p.creator && p.creator._id.equals(userId);
        return obj;
      });
    }

    const total = await Petition.countDocuments(query);
    res.json({ petitions: enhanced, totalPages: Math.ceil(total / limit), currentPage: page, total });
  } catch (error) {
    console.error('Error fetching petitions:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create petition
app.post("/api/petitions", authMiddleware, async (req, res) => {
  try {
    const { title, description, category, location, signatureGoal = 100 } = req.body;
    if (!title || !description || !category || !location) return res.status(400).json({ error: "All fields required" });

    const norm = normalizeCategory(category);
    if (!norm) return res.status(400).json({ error: "Invalid category" });

    const petition = new Petition({ title, description, category: norm, location, signatureGoal, creator: req.user._id });
    const saved = await petition.save();
    await saved.populate("creator", "fullName email");

    res.status(201).json({ message: "Petition created successfully", petition: saved });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Sign petition
app.post("/api/petitions/:id/sign", authMiddleware, async (req, res) => {
  try {
    const petition = await Petition.findById(req.params.id);
    if (!petition) return res.status(404).json({ error: "Petition not found" });

    if (petition.creator.equals(req.user._id)) return res.status(400).json({ error: "Cannot sign your own petition" });
    const already = petition.signatures.some(sig => sig.user.equals(req.user._id));
    if (already) return res.status(400).json({ error: "Already signed this petition" });

    petition.signatures.push({ user: req.user._id });
    await petition.save();

    res.json({ message: "Petition signed successfully", signatureCount: petition.signatures.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update petition
app.patch("/api/petitions/:id", authMiddleware, async (req, res) => {
  try {
    const petition = await Petition.findById(req.params.id);
    if (!petition) return res.status(404).json({ error: "Petition not found" });
    if (!petition.creator.equals(req.user._id)) return res.status(403).json({ error: "Not authorized to update this petition" });

    if (req.body.category) {
      const norm = normalizeCategory(req.body.category);
      if (!norm) return res.status(400).json({ error: "Invalid category" });
      req.body.category = norm;
    }

    const updated = await Petition.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).populate("creator", "fullName email");
    res.json({ message: "Petition updated successfully", petition: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete petition
app.delete("/api/petitions/:id", authMiddleware, async (req, res) => {
  try {
    const petition = await Petition.findById(req.params.id);
    if (!petition) return res.status(404).json({ error: "Petition not found" });
    if (!petition.creator.equals(req.user._id)) return res.status(403).json({ error: "Not authorized to delete this petition" });

    await Petition.findByIdAndDelete(req.params.id);
    res.json({ message: "Petition deleted successfully", deletedId: req.params.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single petition
app.get("/api/petitions/:id", async (req, res) => {
  try {
    const petition = await Petition.findById(req.params.id)
      .populate('creator', 'fullName email')
      .populate('signatures.user', 'fullName email');
    if (!petition) return res.status(404).json({ error: "Petition not found" });
    
    let enhancedPetition = petition.toObject();
    const userId = req.query.userId;
    if (userId) {
      enhancedPetition.hasSigned = petition.signatures.some(
        signature => signature.user._id.equals(userId)
      );
      enhancedPetition.isMyPetition = enhancedPetition.creator && enhancedPetition.creator._id.equals(userId);
    }
    res.json(enhancedPetition);
  } catch (error) {
    console.error('Error fetching petition:', error);
    res.status(500).json({ error: error.message });
  }
});

// Dashboard stats
app.get("/api/dashboard/stats", authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    const [myPetitions, signedPetitions, activePetitions] = await Promise.all([
      Petition.countDocuments({ creator: userId }),
      Petition.countDocuments({ "signatures.user": userId, creator: { $ne: userId } }),
      Petition.countDocuments({ status: "active" })
    ]);

    res.json({ myPetitions, signedPetitions, activePetitions });
  } catch (err) {
    console.error('Error fetching dashboard stats:', err);
    res.status(500).json({ error: err.message });
  }
});

// // ========================
// // Poll Routes
// // ========================
// app.post("/api/polls", authMiddleware, async (req, res) => {
//   const { question, options } = req.body;
//   const newPoll = new Poll({
//     question,
//     options: options.map((opt) => ({ option: opt, votes: 0 })),
//     createdBy: req.user._id,
//   });
//   await newPoll.save();
//   res.json(newPoll);
// });

// app.get("/api/polls", async (req, res) => {
//   const polls = await Poll.find();
//   res.json(polls);
// });

// ========================
// Notifications Routes
// ========================
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

// ========================
// Engagement Routes
// ========================
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