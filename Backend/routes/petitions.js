






import express from "express";
import jwt from "jsonwebtoken";
import Petition from "../models/Petition.js";
import User from "../models/User.js";

const router = express.Router();

// Authentication middleware to protect routes
const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Access denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) return res.status(404).json({ message: "User not found" });
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid token" });
  }
};

// --- PETITION ROUTES ---

// Get all petitions with filtering and user-specific data
router.get("/", async (req, res) => {
  try {
    const { userId /* and other filters */ } = req.query;
    let query = {}; // Add your filter logic here based on req.query
    const petitions = await Petition.find(query).populate('creator', 'fullName email').sort({ createdAt: -1 });

    // Add `isMyPetition` and `hasSigned` flags if a userId is provided
    let enhancedPetitions = petitions;
    if (userId) {
      enhancedPetitions = petitions.map(p => {
        const obj = p.toObject();
        obj.hasSigned = p.signatures.some(sig => sig.user.equals(userId));
        obj.isMyPetition = p.creator && p.creator._id.equals(userId);
        return obj;
      });
    }
    res.json({ petitions: enhancedPetitions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ** THIS IS THE MISSING ROUTE **
// Get all petitions created by the logged-in user
router.get("/user/my-petitions", authMiddleware, async (req, res) => {
    try {
      const petitions = await Petition.find({ creator: req.user.id }).populate("creator", "fullName email");
      res.json(petitions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user petitions" });
    }
});

// Create a new petition
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, description, category, location, signatureGoal = 100 } = req.body;
    if (!title || !description || !category || !location) return res.status(400).json({ error: "All fields required" });

    const petition = new Petition({ title, description, category, location, signatureGoal, creator: req.user.id });
    const savedPetition = await petition.save();
    await savedPetition.populate("creator", "fullName email");
    res.status(201).json({ message: "Petition created", petition: savedPetition });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Sign a petition
router.post("/:id/sign", authMiddleware, async (req, res) => {
  try {
    const petition = await Petition.findById(req.params.id);
    if (!petition) return res.status(404).json({ error: "Petition not found" });
    if (petition.creator.toString() === req.user.id) return res.status(400).json({ error: "Cannot sign own petition" });
    if (petition.signatures.some(s => s.user.toString() === req.user.id)) return res.status(400).json({ error: "Already signed" });
    
    petition.signatures.push({ user: req.user.id });
    await petition.save();
    res.json({ message: "Petition signed", signatureCount: petition.signatures.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a petition
router.patch("/:id", authMiddleware, async (req, res) => {
    try {
        const petition = await Petition.findById(req.params.id);
        if (!petition) return res.status(404).json({ error: "Petition not found" });
        if (petition.creator.toString() !== req.user.id) return res.status(403).json({ error: "Not authorized" });

        const updatedPetition = await Petition.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).populate("creator", "fullName email");
        res.json({ message: "Petition updated", petition: updatedPetition });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a petition
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const petition = await Petition.findById(req.params.id);
        if (!petition) return res.status(404).json({ error: "Petition not found" });
        if (petition.creator.toString() !== req.user.id) return res.status(403).json({ error: "Not authorized to delete this petition" });

        await Petition.findByIdAndDelete(req.params.id);
        res.json({ message: "Petition deleted successfully", deletedId: req.params.id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
