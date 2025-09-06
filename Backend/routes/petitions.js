import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import Petition from "../models/Petition.js";

const router = express.Router();

// Get all petitions (with filtering)
router.get("/", async (req, res) => {
  try {
    console.log('📋 Fetching petitions with query:', req.query);
    
    const { category, location, status, search, page = 1, limit = 10 } = req.query;
    
    let query = {};
    
    // Build filter query
    if (category && category !== 'all') query.category = category;
    if (location && location !== 'all') query.location = location;
    if (status && status !== 'all') query.status = status;
    
    // Search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const petitions = await Petition.find(query)
      .populate('creator', 'fullName email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Petition.countDocuments(query);

    console.log(`✅ Found ${petitions.length} petitions out of ${total}`);

    res.json({
      petitions,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('❌ Error fetching petitions:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get single petition
router.get("/:id", async (req, res) => {
  try {
    console.log('📋 Fetching petition:', req.params.id);
    
    const petition = await Petition.findById(req.params.id)
      .populate('creator', 'fullName email')
      .populate('signatures.user', 'fullName');

    if (!petition) {
      console.log('❌ Petition not found:', req.params.id);
      return res.status(404).json({ error: "Petition not found" });
    }

    console.log('✅ Petition found:', petition.title);
    res.json(petition);
  } catch (error) {
    console.error('❌ Error fetching petition:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create new petition (protected)
router.post("/", authMiddleware, async (req, res) => {
  try {
    console.log('📝 Creating petition:', req.body);
    console.log('👤 User ID:', req.user.id);

    const { title, description, category, location, status = 'active', signatureGoal = 100 } = req.body;

    // Validate required fields
    if (!title || !description || !category || !location) {
      return res.status(400).json({ 
        error: "All fields (title, description, category, location) are required" 
      });
    }

    const petition = new Petition({
      title,
      description,
      category,
      location,
      status,
      signatureGoal,
      creator: req.user.id
    });

    // Save to database
    const savedPetition = await petition.save();
    console.log('✅ Petition saved with ID:', savedPetition._id);

    // Populate creator info
    await savedPetition.populate('creator', 'fullName email');

    res.status(201).json({
      message: "Petition created successfully",
      petition: savedPetition
    });

  } catch (error) {
    console.error('❌ Error creating petition:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ error: errors.join(', ') });
    }
    
    res.status(500).json({ 
      error: "Server error creating petition",
      message: error.message 
    });
  }
});

// Update petition (protected - creator only)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    console.log('📝 Updating petition:', req.params.id);
    console.log('📦 Update data:', req.body);

    const petition = await Petition.findById(req.params.id);

    if (!petition) {
      console.log('❌ Petition not found for update:', req.params.id);
      return res.status(404).json({ error: "Petition not found" });
    }

    // Check if user is the creator
    if (petition.creator.toString() !== req.user.id) {
      console.log('❌ Unauthorized update attempt by user:', req.user.id);
      return res.status(403).json({ error: "Not authorized" });
    }

    const updatedPetition = await Petition.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('creator', 'fullName email');

    console.log('✅ Petition updated successfully');
    res.json(updatedPetition);
  } catch (error) {
    console.error('❌ Error updating petition:', error);
    res.status(400).json({ error: error.message });
  }
});

// Delete petition (protected - creator only)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    console.log('🗑️ Deleting petition:', req.params.id);

    const petition = await Petition.findById(req.params.id);

    if (!petition) {
      console.log('❌ Petition not found for deletion:', req.params.id);
      return res.status(404).json({ error: "Petition not found" });
    }

    if (petition.creator.toString() !== req.user.id) {
      console.log('❌ Unauthorized deletion attempt by user:', req.user.id);
      return res.status(403).json({ error: "Not authorized" });
    }

    await Petition.findByIdAndDelete(req.params.id);
    console.log('✅ Petition deleted successfully');
    
    res.json({ message: "Petition deleted successfully" });
  } catch (error) {
    console.error('❌ Error deleting petition:', error);
    res.status(500).json({ error: error.message });
  }
});

// Sign petition (protected)
router.post("/:id/sign", authMiddleware, async (req, res) => {
  try {
    console.log('✍️ Signing petition:', req.params.id);
    console.log('👤 Signing user:', req.user.id);

    const petition = await Petition.findById(req.params.id);

    if (!petition) {
      console.log('❌ Petition not found for signing:', req.params.id);
      return res.status(404).json({ error: "Petition not found" });
    }

    // Check if user already signed
    const alreadySigned = petition.signatures.some(
      signature => signature.user.toString() === req.user.id
    );

    if (alreadySigned) {
      console.log('❌ User already signed this petition');
      return res.status(400).json({ error: "Already signed this petition" });
    }

    // Check if user is trying to sign their own petition
    if (petition.creator.toString() === req.user.id) {
      console.log('❌ User trying to sign own petition');
      return res.status(400).json({ error: "Cannot sign your own petition" });
    }

    petition.signatures.push({ user: req.user.id });
    await petition.save();

    console.log('✅ Petition signed successfully. Total signatures:', petition.signatures.length);
    
    res.json({ 
      message: "Petition signed successfully", 
      signatureCount: petition.signatures.length 
    });
  } catch (error) {
    console.error('❌ Error signing petition:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get user's petitions
router.get("/user/my-petitions", authMiddleware, async (req, res) => {
  try {
    console.log('📋 Fetching user petitions for:', req.user.id);

    const petitions = await Petition.find({ creator: req.user.id })
      .populate('creator', 'fullName email')
      .sort({ createdAt: -1 });

    console.log(`✅ Found ${petitions.length} petitions for user`);
    
    res.json(petitions);
  } catch (error) {
    console.error('❌ Error fetching user petitions:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get petitions signed by user
router.get("/user/signed-petitions", authMiddleware, async (req, res) => {
  try {
    console.log('📋 Fetching signed petitions for user:', req.user.id);

    const petitions = await Petition.find({ 
      'signatures.user': req.user.id,
      'creator': { $ne: req.user.id } // Exclude user's own petitions
    })
    .populate('creator', 'fullName email')
    .sort({ createdAt: -1 });

    console.log(`✅ Found ${petitions.length} signed petitions`);
    
    res.json(petitions);
  } catch (error) {
    console.error('❌ Error fetching signed petitions:', error);
    res.status(500).json({ error: error.message });
  }
});

// Test route for debugging
router.get("/debug/test", async (req, res) => {
  try {
    console.log('🧪 Testing petitions route');
    
    // Create a test petition
    const testPetition = new Petition({
      title: "Test Petition - " + new Date().toISOString(),
      description: "This is a test petition for debugging",
      category: "environment",
      location: "Test City",
      creator: "000000000000000000000000" // Dummy ID
    });

    // Test validation
    await testPetition.validate();
    
    res.json({ 
      message: "Petitions route is working",
      test: "Validation passed",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Debug test failed:', error);
    res.status(500).json({ 
      error: "Debug test failed",
      message: error.message 
    });
  }
});

export default router;