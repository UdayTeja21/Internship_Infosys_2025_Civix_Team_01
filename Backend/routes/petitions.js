// // // import express from "express";
// // // import authMiddleware from "../middleware/authMiddleware.js";
// // // import Petition from "../models/Petition.js";

// // // const router = express.Router();

// // // // Get all petitions (with filtering)
// // // router.get("/", async (req, res) => {
// // //   try {
// // //     console.log('📋 Fetching petitions with query:', req.query);
    
// // //     const { category, location, status, search, page = 1, limit = 10, userId } = req.query;
    
// // //     let query = {};
    
// // //     // Build filter query
// // //     if (category && category !== 'all') query.category = category;
// // //     if (location && location !== 'all') query.location = location;
// // //     if (status && status !== 'all') query.status = status;
    
// // //     // Search functionality
// // //     if (search) {
// // //       query.$or = [
// // //         { title: { $regex: search, $options: 'i' } },
// // //         { description: { $regex: search, $options: 'i' } }
// // //       ];
// // //     }

// // //     const petitions = await Petition.find(query)
// // //       .populate('creator', 'fullName email')
// // //       .sort({ createdAt: -1 })
// // //       .limit(limit * 1)
// // //       .skip((page - 1) * limit);

// // //     // Check if user has signed each petition
// // //     let enhancedPetitions = petitions;
// // //     if (userId && userId !== 'undefined') {
// // //       enhancedPetitions = await Promise.all(petitions.map(async (petition) => {
// // //         const petitionObj = petition.toObject();
// // //         petitionObj.hasSigned = petition.signatures.some(
// // //           signature => signature.user.toString() === userId
// // //         );
// // //         petitionObj.isMyPetition = petition.creator._id.toString() === userId;
// // //         return petitionObj;
// // //       }));
// // //     }

// // //     const total = await Petition.countDocuments(query);

// // //     console.log(`✅ Found ${petitions.length} petitions out of ${total}`);

// // //     res.json({
// // //       petitions: enhancedPetitions,
// // //       totalPages: Math.ceil(total / limit),
// // //       currentPage: page,
// // //       total
// // //     });
// // //   } catch (error) {
// // //     console.error('❌ Error fetching petitions:', error);
// // //     res.status(500).json({ error: error.message });
// // //   }
// // // });

// // // // Get dashboard statistics
// // // router.get("/dashboard/stats", authMiddleware, async (req, res) => {
// // //   try {
// // //     const userId = req.user.id;
    
// // //     const [
// // //       myPetitionsCount,
// // //       signedPetitionsCount,
// // //       activePetitionsCount,
// // //       successfulPetitionsCount
// // //     ] = await Promise.all([
// // //       // My petitions
// // //       Petition.countDocuments({ creator: userId }),
// // //       // Signed petitions (excluding my own)
// // //       Petition.countDocuments({ 
// // //         'signatures.user': userId,
// // //         'creator': { $ne: userId }
// // //       }),
// // //       // All active petitions
// // //       Petition.countDocuments({ status: 'active' }),
// // //       // Successful petitions (reached goal or under review)
// // //       Petition.countDocuments({ 
// // //         $or: [
// // //           { $expr: { $gte: [{ $size: "$signatures" }, "$signatureGoal"] } },
// // //           { status: 'closed' }
// // //         ]
// // //       })
// // //     ]);

// // //     res.json({
// // //       myPetitions: myPetitionsCount,
// // //       signedPetitions: signedPetitionsCount,
// // //       activePetitions: activePetitionsCount,
// // //       successfulPetitions: successfulPetitionsCount
// // //     });
// // //   } catch (error) {
// // //     console.error('Error fetching dashboard stats:', error);
// // //     res.status(500).json({ error: error.message });
// // //   }
// // // });

// // // // Get recent petitions for dashboard
// // // router.get("/dashboard/recent", async (req, res) => {
// // //   try {
// // //     const recentPetitions = await Petition.find({ status: 'active' })
// // //       .populate('creator', 'fullName email')
// // //       .sort({ createdAt: -1 })
// // //       .limit(4);

// // //     res.json(recentPetitions);
// // //   } catch (error) {
// // //     console.error('Error fetching recent petitions:', error);
// // //     res.status(500).json({ error: error.message });
// // //   }
// // // });

// // // // Create new petition (protected)
// // // router.post("/", authMiddleware, async (req, res) => {
// // //   try {
// // //     console.log('📝 Creating petition:', req.body);
// // //     console.log('👤 User ID:', req.user.id);

// // //     const { title, description, category, location, status = 'active', signatureGoal = 100 } = req.body;

// // //     // Validate required fields
// // //     if (!title || !description || !category || !location) {
// // //       return res.status(400).json({ 
// // //         error: "All fields (title, description, category, location) are required" 
// // //       });
// // //     }

// // //     const petition = new Petition({
// // //       title,
// // //       description,
// // //       category,
// // //       location,
// // //       status,
// // //       signatureGoal,
// // //       creator: req.user.id
// // //     });

// // //     // Save to database
// // //     const savedPetition = await petition.save();
// // //     console.log('✅ Petition saved with ID:', savedPetition._id);

// // //     // Populate creator info
// // //     await savedPetition.populate('creator', 'fullName email');

// // //     res.status(201).json({
// // //       message: "Petition created successfully",
// // //       petition: savedPetition
// // //     });

// // //   } catch (error) {
// // //     console.error('❌ Error creating petition:', error);
    
// // //     if (error.name === 'ValidationError') {
// // //       const errors = Object.values(error.errors).map(err => err.message);
// // //       return res.status(400).json({ error: errors.join(', ') });
// // //     }
    
// // //     res.status(500).json({ 
// // //       error: "Server error creating petition",
// // //       message: error.message 
// // //     });
// // //   }
// // // });

// // // // Sign petition (protected)
// // // router.post("/:id/sign", authMiddleware, async (req, res) => {
// // //   try {
// // //     console.log('✍️ Signing petition:', req.params.id);
// // //     console.log('👤 Signing user:', req.user.id);

// // //     const petition = await Petition.findById(req.params.id);

// // //     if (!petition) {
// // //       console.log('❌ Petition not found for signing:', req.params.id);
// // //       return res.status(404).json({ error: "Petition not found" });
// // //     }

// // //     // Check if user already signed
// // //     const alreadySigned = petition.signatures.some(
// // //       signature => signature.user.toString() === req.user.id
// // //     );

// // //     if (alreadySigned) {
// // //       console.log('❌ User already signed this petition');
// // //       return res.status(400).json({ error: "Already signed this petition" });
// // //     }

// // //     // Check if user is trying to sign their own petition
// // //     if (petition.creator.toString() === req.user.id) {
// // //       console.log('❌ User trying to sign own petition');
// // //       return res.status(400).json({ error: "Cannot sign your own petition" });
// // //     }

// // //     petition.signatures.push({ user: req.user.id });
// // //     await petition.save();

// // //     console.log('✅ Petition signed successfully. Total signatures:', petition.signatures.length);
    
// // //     res.json({ 
// // //       message: "Petition signed successfully", 
// // //       signatureCount: petition.signatures.length 
// // //     });
// // //   } catch (error) {
// // //     console.error('❌ Error signing petition:', error);
// // //     res.status(500).json({ error: error.message });
// // //   }
// // // });

// // // // Get user's petitions
// // // router.get("/user/my-petitions", authMiddleware, async (req, res) => {
// // //   try {
// // //     console.log('📋 Fetching user petitions for:', req.user.id);

// // //     const petitions = await Petition.find({ creator: req.user.id })
// // //       .populate('creator', 'fullName email')
// // //       .sort({ createdAt: -1 });

// // //     console.log(`✅ Found ${petitions.length} petitions for user`);
    
// // //     res.json(petitions);
// // //   } catch (error) {
// // //     console.error('❌ Error fetching user petitions:', error);
// // //     res.status(500).json({ error: error.message });
// // //   }
// // // });

// // // // Get petitions signed by user
// // // router.get("/user/signed-petitions", authMiddleware, async (req, res) => {
// // //   try {
// // //     console.log('📋 Fetching signed petitions for user:', req.user.id);

// // //     const petitions = await Petition.find({ 
// // //       'signatures.user': req.user.id,
// // //       'creator': { $ne: req.user.id } // Exclude user's own petitions
// // //     })
// // //     .populate('creator', 'fullName email')
// // //     .sort({ createdAt: -1 });

// // //     console.log(`✅ Found ${petitions.length} signed petitions`);
    
// // //     res.json(petitions);
// // //   } catch (error) {
// // //     console.error('❌ Error fetching signed petitions:', error);
// // //     res.status(500).json({ error: error.message });
// // //   }
// // // });

// // // export default router;




// // // routes/petitionRoutes.js
// // import express from "express";
// // import authMiddleware from "../middleware/authMiddleware.js";
// // import Petition from "../models/Petition.js";

// // const router = express.Router();

// // // Get all petitions (filter + search + pagination)
// // router.get("/", async (req, res) => {
// //   try {
// //     const { category, location, status, search, page = 1, limit = 10, userId } = req.query;

// //     let query = {};
// //     if (category && category !== "all") query.category = category;
// //     if (location && location !== "all") query.location = new RegExp(location, "i");
// //     if (status && status !== "all") query.status = status;

// //     if (search) {
// //       query.$or = [
// //         { title: new RegExp(search, "i") },
// //         { description: new RegExp(search, "i") }
// //       ];
// //     }

// //     const petitions = await Petition.find(query)
// //       .populate("creator", "fullName email")
// //       .sort({ createdAt: -1 })
// //       .limit(limit * 1)
// //       .skip((page - 1) * limit);

// //     // enhance petitions with user info
// //     let enhanced = petitions;
// //     if (userId) {
// //       enhanced = petitions.map(p => {
// //         const obj = p.toObject();
// //         obj.hasSigned = p.signatures.some(sig => sig.user.toString() === userId);
// //         obj.isMyPetition = p.creator._id.toString() === userId;
// //         return obj;
// //       });
// //     }

// //     const total = await Petition.countDocuments(query);

// //     res.json({
// //       petitions: enhanced,
// //       totalPages: Math.ceil(total / limit),
// //       currentPage: page,
// //       total
// //     });
// //   } catch (err) {
// //     res.status(500).json({ error: err.message });
// //   }
// // });

// // // Dashboard stats
// // router.get("/dashboard/stats", authMiddleware, async (req, res) => {
// //   try {
// //     const userId = req.user.id;
// //     const [myPetitions, signedPetitions, activePetitions, successfulPetitions] = await Promise.all([
// //       Petition.countDocuments({ creator: userId }),
// //       Petition.countDocuments({ "signatures.user": userId, creator: { $ne: userId } }),
// //       Petition.countDocuments({ status: "active" }),
// //       Petition.countDocuments({
// //         $or: [
// //           { $expr: { $gte: [{ $size: "$signatures" }, "$signatureGoal"] } },
// //           { status: "closed" }
// //         ]
// //       })
// //     ]);

// //     res.json({ myPetitions, signedPetitions, activePetitions, successfulPetitions });
// //   } catch (err) {
// //     res.status(500).json({ error: err.message });
// //   }
// // });

// // // Create petition
// // router.post("/", authMiddleware, async (req, res) => {
// //   try {
// //     const { title, description, category, location, signatureGoal = 100 } = req.body;

// //     if (!title || !description || !category || !location) {
// //       return res.status(400).json({ error: "All fields are required" });
// //     }

// //     const petition = new Petition({
// //       title,
// //       description,
// //       category,
// //       location,
// //       signatureGoal,
// //       creator: req.user.id
// //     });

// //     const saved = await petition.save();
// //     await saved.populate("creator", "fullName email");

// //     res.status(201).json({ message: "Petition created successfully", petition: saved });
// //   } catch (err) {
// //     res.status(500).json({ error: err.message });
// //   }
// // });

// // // Sign petition
// // router.post("/:id/sign", authMiddleware, async (req, res) => {
// //   try {
// //     const petition = await Petition.findById(req.params.id);
// //     if (!petition) return res.status(404).json({ error: "Petition not found" });

// //     if (petition.signatures.some(s => s.user.toString() === req.user.id)) {
// //       return res.status(400).json({ error: "Already signed" });
// //     }
// //     if (petition.creator.toString() === req.user.id) {
// //       return res.status(400).json({ error: "Cannot sign own petition" });
// //     }

// //     petition.signatures.push({ user: req.user.id });
// //     await petition.save();

// //     res.json({ message: "Signed successfully", signatureCount: petition.signatures.length });
// //   } catch (err) {
// //     res.status(500).json({ error: err.message });
// //   }
// // });

// // // Update petition
// // router.patch("/:id", authMiddleware, async (req, res) => {
// //   try {
// //     const petition = await Petition.findById(req.params.id);
// //     if (!petition) return res.status(404).json({ error: "Petition not found" });

// //     if (petition.creator.toString() !== req.user.id) {
// //       return res.status(403).json({ error: "Not authorized" });
// //     }

// //     const updated = await Petition.findByIdAndUpdate(req.params.id, req.body, {
// //       new: true,
// //       runValidators: true
// //     }).populate("creator", "fullName email");

// //     res.json({ message: "Petition updated", petition: updated });
// //   } catch (err) {
// //     res.status(500).json({ error: err.message });
// //   }
// // });

// // // Get my petitions
// // router.get("/user/my-petitions", authMiddleware, async (req, res) => {
// //   const petitions = await Petition.find({ creator: req.user.id }).populate("creator", "fullName email");
// //   res.json(petitions);
// // });

// // // Get signed petitions
// // router.get("/user/signed-petitions", authMiddleware, async (req, res) => {
// //   const petitions = await Petition.find({ "signatures.user": req.user.id, creator: { $ne: req.user.id } })
// //     .populate("creator", "fullName email")
// //     .sort({ createdAt: -1 });

// //   res.json(petitions);
// // });

// // // Get single petition
// // router.get("/:id", async (req, res) => {
// //   try {
// //     console.log('📋 Fetching petition:', req.params.id);
    
// //     const petition = await Petition.findById(req.params.id)
// //       .populate('creator', 'fullName email')
// //       .populate('signatures.user', 'fullName email');

// //     if (!petition) {
// //       console.log('❌ Petition not found:', req.params.id);
// //       return res.status(404).json({ error: "Petition not found" });
// //     }

// //     // Check if user has signed
// //     let enhancedPetition = petition.toObject();
// //     const userId = req.query.userId;
    
// //     if (userId && userId !== 'undefined') {
// //       enhancedPetition.hasSigned = petition.signatures.some(
// //         signature => signature.user._id.toString() === userId
// //       );
// //       enhancedPetition.isMyPetition = petition.creator._id.toString() === userId;
// //     }

// //     console.log('✅ Petition found:', enhancedPetition.title);
// //     res.json(enhancedPetition);
// //   } catch (error) {
// //     console.error('❌ Error fetching petition:', error);
// //     res.status(500).json({ error: error.message });
// //   }
// // });

// // // Delete petition
// // router.delete("/:id", authMiddleware, async (req, res) => {
// //   try {
// //     console.log('🗑️ Deleting petition:', req.params.id);
// //     console.log('👤 User ID:', req.user.id);

// //     const petition = await Petition.findById(req.params.id);

// //     if (!petition) {
// //       console.log('❌ Petition not found for deletion:', req.params.id);
// //       return res.status(404).json({ error: "Petition not found" });
// //     }

// //     // Check if user is the creator
// //     if (petition.creator.toString() !== req.user.id) {
// //       console.log('❌ User not authorized to delete this petition');
// //       return res.status(403).json({ error: "Not authorized to delete this petition" });
// //     }

// //     await Petition.findByIdAndDelete(req.params.id);
// //     console.log('✅ Petition deleted successfully');

// //     res.json({ 
// //       message: "Petition deleted successfully",
// //       deletedId: req.params.id
// //     });
// //   } catch (error) {
// //     console.error('❌ Error deleting petition:', error);
// //     res.status(500).json({ error: error.message });
// //   }
// // });

// // // Admin routes
// // router.patch("/admin/:id/status", authMiddleware, async (req, res) => {
// //   try {
// //     // Check if user is admin
// //     if (req.user.role !== 'admin') {
// //       return res.status(403).json({ error: "Admin access required" });
// //     }

// //     const { status } = req.body;
    
// //     if (!['active', 'under_review', 'closed'].includes(status)) {
// //       return res.status(400).json({ error: "Invalid status" });
// //     }

// //     const petition = await Petition.findByIdAndUpdate(
// //       req.params.id,
// //       { status },
// //       { new: true, runValidators: true }
// //     ).populate('creator', 'fullName email');

// //     if (!petition) {
// //       return res.status(404).json({ error: "Petition not found" });
// //     }

// //     res.json({
// //       message: "Petition status updated successfully",
// //       petition
// //     });
// //   } catch (error) {
// //     console.error('Error updating petition status:', error);
// //     res.status(500).json({ error: error.message });
// //   }
// // });

// // router.get("/admin/all", authMiddleware, async (req, res) => {
// //   try {
// //     // Check if user is admin
// //     if (req.user.role !== 'admin') {
// //       return res.status(403).json({ error: "Admin access required" });
// //     }

// //     const { page = 1, limit = 20, status } = req.query;
    
// //     let query = {};
// //     if (status && status !== 'all') query.status = status;

// //     const petitions = await Petition.find(query)
// //       .populate('creator', 'fullName email')
// //       .sort({ createdAt: -1 })
// //       .limit(limit * 1)
// //       .skip((page - 1) * limit);

// //     const total = await Petition.countDocuments(query);

// //     res.json({
// //       petitions,
// //       totalPages: Math.ceil(total / limit),
// //       currentPage: page,
// //       total
// //     });
// //   } catch (error) {
// //     console.error('Error fetching admin petitions:', error);
// //     res.status(500).json({ error: error.message });
// //   }
// // });

// // export default router;






// // routes/petitionRoutes.js
// import express from "express";
// import authMiddleware from "../middleware/authMiddleware.js";
// import Petition from "../models/Petition.js";

// const router = express.Router();

// // Get all petitions (filter + search + pagination)
// router.get("/", async (req, res) => {
//   try {
//     // FIX: Get the 'limit' value from the request query instead of using a hardcoded default.
//     // If a limit is not provided, use a large number (e.g., 1000) by default.
//     const { category, location, status, search, page = 1, limit = 1000, userId } = req.query;

//     let query = {};
//     if (category && category !== "all") query.category = category;
//     if (location && location !== "all") query.location = new RegExp(location, "i");
//     if (status && status !== "all") query.status = status;

//     if (search) {
//       query.$or = [
//         { title: new RegExp(search, "i") },
//         { description: new RegExp(search, "i") }
//       ];
//     }

//     const petitions = await Petition.find(query)
//       .populate("creator", "fullName email")
//       .sort({ createdAt: -1 })
//       .limit(limit * 1)
//       .skip((page - 1) * limit);

//     // enhance petitions with user info
//     let enhanced = petitions;
//     if (userId) {
//       enhanced = petitions.map(p => {
//         const obj = p.toObject();
//         obj.hasSigned = p.signatures.some(sig => sig.user.toString() === userId);
//         obj.isMyPetition = p.creator._id.toString() === userId;
//         return obj;
//       });
//     }

//     const total = await Petition.countDocuments(query);

//     res.json({
//       petitions: enhanced,
//       totalPages: Math.ceil(total / limit),
//       currentPage: page,
//       total
//     });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Dashboard stats
// router.get("/dashboard/stats", authMiddleware, async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const [myPetitions, signedPetitions, activePetitions, successfulPetitions] = await Promise.all([
//       Petition.countDocuments({ creator: userId }),
//       Petition.countDocuments({ "signatures.user": userId, creator: { $ne: userId } }),
//       Petition.countDocuments({ status: "active" }),
//       Petition.countDocuments({
//         $or: [
//           { $expr: { $gte: [{ $size: "$signatures" }, "$signatureGoal"] } },
//           { status: "closed" }
//         ]
//       })
//     ]);

//     res.json({ myPetitions, signedPetitions, activePetitions, successfulPetitions });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Create petition
// router.post("/", authMiddleware, async (req, res) => {
//   try {
//     const { title, description, category, location, signatureGoal = 100 } = req.body;

//     if (!title || !description || !category || !location) {
//       return res.status(400).json({ error: "All fields are required" });
//     }

//     const petition = new Petition({
//       title,
//       description,
//       category,
//       location,
//       signatureGoal,
//       creator: req.user.id
//     });

//     const saved = await petition.save();
//     await saved.populate("creator", "fullName email");

//     res.status(201).json({ message: "Petition created successfully", petition: saved });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Sign petition
// router.post("/:id/sign", authMiddleware, async (req, res) => {
//   try {
//     const petition = await Petition.findById(req.params.id);
//     if (!petition) return res.status(404).json({ error: "Petition not found" });

//     if (petition.signatures.some(s => s.user.toString() === req.user.id)) {
//       return res.status(400).json({ error: "Already signed" });
//     }
//     if (petition.creator.toString() === req.user.id) {
//       return res.status(400).json({ error: "Cannot sign own petition" });
//     }

//     petition.signatures.push({ user: req.user.id });
//     await petition.save();

//     res.json({ message: "Signed successfully", signatureCount: petition.signatures.length });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Update petition
// router.patch("/:id", authMiddleware, async (req, res) => {
//   try {
//     const petition = await Petition.findById(req.params.id);
//     if (!petition) return res.status(404).json({ error: "Petition not found" });

//     if (petition.creator.toString() !== req.user.id) {
//       return res.status(403).json({ error: "Not authorized" });
//     }

//     const updated = await Petition.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//       runValidators: true
//     }).populate("creator", "fullName email");

//     res.json({ message: "Petition updated", petition: updated });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Get my petitions
// router.get("/user/my-petitions", authMiddleware, async (req, res) => {
//   const petitions = await Petition.find({ creator: req.user.id }).populate("creator", "fullName email");
//   res.json(petitions);
// });

// // Get signed petitions
// router.get("/user/signed-petitions", authMiddleware, async (req, res) => {
//   const petitions = await Petition.find({ "signatures.user": req.user.id, creator: { $ne: req.user.id } })
//     .populate("creator", "fullName email")
//     .sort({ createdAt: -1 });

//   res.json(petitions);
// });

// // Get single petition
// router.get("/:id", async (req, res) => {
//   try {
//     console.log('📋 Fetching petition:', req.params.id);
    
//     const petition = await Petition.findById(req.params.id)
//       .populate('creator', 'fullName email')
//       .populate('signatures.user', 'fullName email');

//     if (!petition) {
//       console.log('❌ Petition not found:', req.params.id);
//       return res.status(404).json({ error: "Petition not found" });
//     }

//     // Check if user has signed
//     let enhancedPetition = petition.toObject();
//     const userId = req.query.userId;
    
//     if (userId && userId !== 'undefined') {
//       enhancedPetition.hasSigned = petition.signatures.some(
//         signature => signature.user._id.toString() === userId
//       );
//       enhancedPetition.isMyPetition = petition.creator._id.toString() === userId;
//     }

//     console.log('✅ Petition found:', enhancedPetition.title);
//     res.json(enhancedPetition);
//   } catch (error) {
//     console.error('❌ Error fetching petition:', error);
//     res.status(500).json({ error: error.message });
//   }
// });

// // Delete petition
// router.delete("/:id", authMiddleware, async (req, res) => {
//   try {
//     console.log('🗑️ Deleting petition:', req.params.id);
//     console.log('👤 User ID:', req.user.id);

//     const petition = await Petition.findById(req.params.id);

//     if (!petition) {
//       console.log('❌ Petition not found for deletion:', req.params.id);
//       return res.status(404).json({ error: "Petition not found" });
//     }

//     // Check if user is the creator
//     if (petition.creator.toString() !== req.user.id) {
//       console.log('❌ User not authorized to delete this petition');
//       return res.status(403).json({ error: "Not authorized to delete this petition" });
//     }

//     await Petition.findByIdAndDelete(req.params.id);
//     console.log('✅ Petition deleted successfully');

//     res.json({ 
//       message: "Petition deleted successfully",
//       deletedId: req.params.id
//     });
//   } catch (error) {
//     console.error('❌ Error deleting petition:', error);
//     res.status(500).json({ error: error.message });
//   }
// });

// // Admin routes
// router.patch("/admin/:id/status", authMiddleware, async (req, res) => {
//   try {
//     // Check if user is admin
//     if (req.user.role !== 'admin') {
//       return res.status(403).json({ error: "Admin access required" });
//     }

//     const { status } = req.body;
    
//     if (!['active', 'under_review', 'closed'].includes(status)) {
//       return res.status(400).json({ error: "Invalid status" });
//     }

//     const petition = await Petition.findByIdAndUpdate(
//       req.params.id,
//       { status },
//       { new: true, runValidators: true }
//     ).populate('creator', 'fullName email');

//     if (!petition) {
//       return res.status(404).json({ error: "Petition not found" });
//     }

//     res.json({
//       message: "Petition status updated successfully",
//       petition
//     });
//   } catch (error) {
//     console.error('Error updating petition status:', error);
//     res.status(500).json({ error: error.message });
//   }
// });

// router.get("/admin/all", authMiddleware, async (req, res) => {
//   try {
//     // Check if user is admin
//     if (req.user.role !== 'admin') {
//       return res.status(403).json({ error: "Admin access required" });
//     }

//     const { page = 1, limit = 1000, status } = req.query;
    
//     let query = {};
//     if (status && status !== 'all') query.status = status;

//     const petitions = await Petition.find(query)
//       .populate('creator', 'fullName email')
//       .sort({ createdAt: -1 })
//       .limit(limit * 1)
//       .skip((page - 1) * limit);

//     const total = await Petition.countDocuments(query);

//     res.json({
//       petitions,
//       totalPages: Math.ceil(total / limit),
//       currentPage: page,
//       total
//     });
//   } catch (error) {
//     console.error('Error fetching admin petitions:', error);
//     res.status(500).json({ error: error.message });
//   }
// });

// export default router;






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
