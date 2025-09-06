import express from "express";
import {
  debugUsers,
  forgotPassword,
  login,
  resetPassword,
  signup,
  testLogin,
  verifyOtp
} from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

console.log("✅ Auth routes loaded");

// Add proper middleware logging
router.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.path}`, req.body);
  next();
});

// Public routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);

// Debug routes (for testing)
router.get("/debug-users", debugUsers);
router.post("/test-login", testLogin);

// Test route
router.post("/test", (req, res) => {
  console.log("✅ Test POST received:", req.body);
  res.json({ message: "POST test successful", data: req.body });
});

// Protected routes
router.get("/me", authMiddleware, (req, res) => {
  res.json({ 
    message: "Protected route access granted", 
    user: req.user 
  });
});

// Health check
router.get("/health", (req, res) => {
  res.json({ 
    status: "OK", 
    timestamp: new Date().toISOString(),
    service: "Auth Service"
  });
});

export default router;