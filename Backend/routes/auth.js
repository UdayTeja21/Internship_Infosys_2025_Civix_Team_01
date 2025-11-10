import express from "express";
import {
  forgotPassword,
  login,
  resetPassword,
  signup,
  verifyOtp,
  //requestOtp, // still not needed
} from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Debug logging for all auth routes
router.use((req, res, next) => {
  console.log(`📨 [AUTH] ${req.method} ${req.path}`);
  next();
});

// --- PUBLIC ROUTES ---
router.post("/signup", signup);           // Step 1 → Create user & send OTP
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtp);    // Step 2 → Verify OTP (signup or forgot password)
router.post("/reset-password", resetPassword);

// --- PROTECTED ROUTE ---
router.get("/me", authMiddleware, (req, res) => {
  res.json({
    message: "User data fetched successfully",
    user: req.user,
  });
});

export default router;
