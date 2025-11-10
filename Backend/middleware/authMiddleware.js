
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) return res.status(401).json({ error: "Access denied. No token provided." });

    const token = authHeader.split(" ")[1]; // Bearer <token>
    if (!token) return res.status(401).json({ error: "Token missing" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret");

    // Option 1: Use decoded JWT directly
    req.user = decoded; // decoded should have id and email

    // Option 2 (optional): Fetch full user from DB
    // const user = await User.findById(decoded.id).select("-password");
    // if (!user) return res.status(401).json({ error: "User not found" });
    // req.user = user;

    next();
  } catch (err) {
    console.error("Auth Middleware Error:", err);
    res.status(401).json({ error: "Invalid token" });
  }
};

export default authMiddleware;
