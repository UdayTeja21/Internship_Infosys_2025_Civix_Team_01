import bcrypt from "bcryptjs";
import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

/**
 * @route   GET /api/settings/me
 * @desc    Get logged-in user profile
 * @access  Private
 */    
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error("❌ Error fetching user:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

 /**
  * @route   PUT /api/settings/update
  * @desc    Update fullName and/or profilePic with specific success messages
  * @access  Private
  */
router.put("/update", authMiddleware, async (req, res) => {
  try {
    const { fullName, profilePic } = req.body;

    console.log("Update request received:", { fullName, profilePic });

    // Validate that at least one field is provided
    if (fullName === undefined && profilePic === undefined) {
      return res.status(400).json({ error: "At least one field is required for update" });
    }

    // Validate fullName if provided
    if (fullName !== undefined) {
      if (!fullName || fullName.trim() === "") {
        return res.status(400).json({ error: "Full name cannot be empty" });
      }
      if (fullName.trim().length < 5) {
        return res.status(400).json({ error: "Full name must be at least 5 characters" });
      }
    }

    // Build update object and track what's being updated
    const updateData = {};
    let updatedFields = [];

    if (fullName !== undefined) {
      updateData.fullName = fullName.trim();
      updatedFields.push("fullName");
    }
    
    if (profilePic !== undefined) {
      updateData.profilePic = profilePic;
      updatedFields.push("profilePic");
    }

    console.log("Updating fields:", updatedFields);

    // Update the user
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { 
        new: true, 
        runValidators: true,
        context: 'query'
      }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

   

    res.json({
      message: "Profile updated successfully",
      user: updatedUser
    });


  } catch (err) {
    console.error("❌ Error updating user profile:", err.message);
    console.error("Error details:", err);
    
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: "Validation error: " + err.message });
    }
    
    // Ensure we always send a proper error object
    res.status(500).json({ 
      error: "Something went wrong. Please try again.",
      details: err.message 
    });
  }
});
// /**


/**
 * @route   PUT /api/settings/update-password
 * @desc    Update user password (verify current, match confirm)
 * @access  Private
 */
router.put("/update-password", authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    // Validate input
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: "New password must be at least 6 characters long" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: "New password and confirm password do not match" });
    }

    // Find user with password field
    const user = await User.findById(req.user.id).select("+password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Current password is incorrect" });
    }

    // ✅ NEW CHECK: Prevent using the same password again
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return res.status(400).json({ error: "New password must be different from the old password" });
    }

    // ✅ FIX: Convert role to lowercase to prevent validation error
    if (user.role) {
      user.role = user.role.toLowerCase();
    }

    // ✅ FIX: Set plain text password - User model's pre-save hook will hash it automatically
    user.password = newPassword;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("❌ Error updating password:", err.message);
    res.status(500).json({ error: "Server error: " + err.message });
  }
});

router.delete("/remove-profile-pic", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $unset: { profilePic: "" } }, // remove the field from DB
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      message: "Profile picture removed successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error("❌ Error removing profile picture:", err);
    res.status(500).json({ error: "Server error while removing profile picture" });
  }
});
export default router;
