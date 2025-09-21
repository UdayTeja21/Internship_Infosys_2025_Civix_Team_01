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
 * @desc    Update fullName and/or profilePic
 * @access  Private
 */
router.put("/update", authMiddleware, async (req, res) => {
  try {
    const { fullName, profilePic } = req.body;
    const updates = {};

    if (fullName !== undefined) updates.fullName = fullName;
    if (profilePic !== undefined) {
  updates.profilePic = profilePic; // allow null explicitly
}

    if (Object.keys(updates).length === 0) {
      return res
        .status(400)
        .json({ error: "No valid fields provided for update" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(updatedUser);
  } catch (err) {
    console.error("❌ Error updating user:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});
// routes/settings.js
router.delete("/remove-profile-pic", authMiddleware, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $unset: { profilePic: "" } },  // remove the field
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "Profile picture removed successfully", user });
  } catch (err) {
    console.error("❌ Error removing profile picture:", err);
    res.status(500).json({ error: "Server error" });
  }
});




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
      return res
        .status(400)
        .json({ error: "New password must be at least 6 characters long" });
    }

    if (newPassword !== confirmPassword) {
      return res
        .status(400)
        .json({ error: "New password and confirm password do not match" });
    }

    // Find user
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Current password is incorrect" });
    }

    // Hash and save new password
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("❌ Error updating password:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;