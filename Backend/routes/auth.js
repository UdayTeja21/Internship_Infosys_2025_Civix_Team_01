import express from "express";
import {
  forgotPassword,
  login,
  resetPassword,
  signup,
  verifyOtp,
} from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Middleware to log incoming auth requests
router.use((req, res, next) => {
  console.log(`📨 [AUTH] ${req.method} ${req.path}`);
  next();
});

// --- PUBLIC ROUTES ---
router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);

// --- PROTECTED ROUTE (Example for fetching current user) ---
router.get("/me", authMiddleware, (req, res) => {
  res.json({
    message: "User data fetched successfully",
    user: req.user
  });
});

export default router;
























// import express from "express";
// import {
//   debugUsers,
//   forgotPassword,
//   login,
//   resetPassword,
//   signup,
//   testLogin,
//   verifyOtp
// } from "../controllers/authController.js";
// import authMiddleware from "../middleware/authMiddleware.js";

// const router = express.Router();

// console.log("✅ Auth routes loaded");

// // Middleware logging
// router.use((req, res, next) => {
//   console.log(`📨 ${req.method} ${req.path}`, req.body);
//   next();
// });

// // Public routes
// router.post("/signup", signup);
// router.post("/login", login);
// router.post("/forgot-password", forgotPassword);
// router.post("/verify-otp", verifyOtp);
// router.post("/reset-password", resetPassword);

// // Debug routes
// router.get("/debug-users", debugUsers);
// router.post("/test-login", testLogin);

// // Protected route
// router.get("/me", authMiddleware, (req, res) => {
//   res.json({ message: "Protected route access granted", user: req.user });
// });

// // Health check
// router.get("/health", (req, res) => {
//   res.json({ status: "OK", service: "Auth Service", timestamp: new Date().toISOString() });
// });

// export default router;
