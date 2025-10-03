import bcrypt from "bcryptjs";
import crypto from "crypto";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import User from "../models/User.js";

dotenv.config();

export const signup = async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: "User already exists with this email" });
    }
    user = new User({
      fullName,
      email,
      password,
      role: (role || "citizen").toLowerCase()
    });
    await user.save();
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.status(201).json({ 
      token,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      }
    });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ error: "Server error during registration" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ 
      token, 
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      } 
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
// ======================
// Password Reset Logic
// ======================
const generateOTP = () => crypto.randomInt(100000, 999999).toString();

const createTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error("FATAL: Email credentials are not configured in .env file.");
    throw new Error("Email service is not configured on the server.");
  }
  return nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
  });
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ message: "If this email is registered, you will receive an OTP." });
    }

    // ✅ DIRECT FIX: Manually ensure the role is lowercase before saving.
    // This is a safeguard that forces the data to be correct before validation.
    user.role = user.role.toLowerCase();

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    
    await user.save(); // Now this should pass validation without any errors.

    const transporter = createTransporter();
    await transporter.sendMail({
      from: `CIVIX <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your Password Reset OTP",
      html: `<p>Your One-Time Password is: <strong>${otp}</strong>. It will expire in 10 minutes.</p>`,
    });

    res.json({ message: "OTP sent to email successfully." });
  } catch (err) {
    console.error("Error in forgotPassword controller:", err);
    res.status(500).json({ error: "An error occurred while trying to send the reset email." });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ error: "Email and OTP are required" });

    const user = await User.findOne({ email }).select('+otp +otpExpiry');
    if (!user || !user.otp || !user.otpExpiry) {
      return res.status(400).json({ error: "Invalid OTP request." });
    }
    if (user.otpExpiry < new Date()) return res.status(400).json({ error: "OTP has expired" });
    if (user.otp !== otp) return res.status(400).json({ error: "Invalid OTP" });

    res.json({ message: "OTP verified successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ error: "All fields are required" });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    const user = await User.findOne({ email }).select('+otp +otpExpiry');
    if (!user || !user.otp || !user.otpExpiry) {
      return res.status(400).json({ error: "Invalid OTP request." });
    }
    if (user.otpExpiry < new Date()) return res.status(400).json({ error: "OTP has expired" });
    if (user.otp !== otp) return res.status(400).json({ error: "Invalid OTP" });

    user.password = newPassword;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    res.json({ message: "Password reset successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};





