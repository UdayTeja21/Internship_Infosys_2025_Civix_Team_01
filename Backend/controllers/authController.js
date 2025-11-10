import bcrypt from "bcryptjs";
import crypto from "crypto";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import User from "../models/User.js";

dotenv.config();

// Reusable helpers
const generateOTP = () => crypto.randomInt(100000, 999999).toString();

const createTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error("FATAL: Email credentials are not configured in .env file.");
    throw new Error("Email service is not configured on the server.");
  }
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { 
      user: process.env.EMAIL_USER, 
      pass: process.env.EMAIL_PASS 
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  console.log("✉️ Email transporter created");
  return transporter;
};

// --------------------
// SIGNUP (with OTP)
// --------------------
export const signup = async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;

    console.log("📝 Signup attempt:", { fullName, email, role });

    // Validation
    if (!fullName || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    // Check if user exists
    let user = await User.findOne({ email: email.toLowerCase().trim() });
    if (user) {
      return res.status(400).json({ error: "User already exists with this email" });
    }

    // Generate OTP & expiry
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Create new user
    user = new User({
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      password: password,
      role: (role || "citizen").toLowerCase(),
      isVerified: false,
      otp,
      otpExpiry
    });

    await user.save();
    console.log("✅ User created successfully:", user.email);

    // Debug log OTP
    console.log(`🔹 OTP for ${email}: ${otp}`);

    // Send OTP email
    try {
      console.log("📧 Attempting to send email...");
      const transporter = createTransporter();
      
      const mailOptions = {
        from: `CIVIX <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Verify your CIVIX account",
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>Welcome to CIVIX!</h2>
            <p>Hello ${fullName},</p>
            <p>Your One-Time Password (OTP) is:</p>
            <h1 style="color: #10b981; letter-spacing: 5px;">${otp}</h1>
            <p>This OTP is valid for <strong>10 minutes</strong>.</p>
            <p>If you didn't request this, please ignore this email.</p>
          </div>
        `
      };
      
      await transporter.sendMail(mailOptions);
      console.log("📧 OTP email sent successfully to:", email);
    } catch (emailError) {
      console.error("❌ Email sending failed:", emailError.message);
      
      // Delete the user if email fails
      await User.deleteOne({ _id: user._id });
      
      return res.status(500).json({ 
        error: "Failed to send verification email. Please try again later.",
        details: process.env.NODE_ENV === 'development' ? emailError.message : undefined
      });
    }

    return res.status(201).json({ 
      message: "OTP sent to email",
      email: email 
    });

  } catch (err) {
    console.error("❌ Signup Error:", err);

    if (err.code === 11000) {
      return res.status(400).json({ error: "Email already exists" });
    }

    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ error: errors.join(", ") });
    }

    if (err.message && err.message.includes("Email service is not configured")) {
      return res.status(500).json({ 
        error: "Email service not configured on server." 
      });
    }

    return res.status(500).json({ 
      error: "Server error during registration. Please try again." 
    });
  }
};

// --------------------
// LOGIN
// --------------------
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log("🔐 Login attempt:", email);

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() })
      .select("+password");
    
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: "7d" }
    );

    console.log("✅ Login successful:", email);

    res.json({
      token,
      user: {
        id: user._id,
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error("❌ Login Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ======================
// Password Reset / OTP Logic
// ======================
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    
    if (!user) {
      // Don't reveal if email exists
      return res.json({ 
        message: "If this email is registered, you will receive an OTP." 
      });
    }

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    await user.save();

    console.log(`🔹 Password Reset OTP for ${email}: ${otp}`);

    const transporter = createTransporter();
    await transporter.sendMail({
      from: `CIVIX <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your Password Reset OTP",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Password Reset Request</h2>
          <p>Your One-Time Password is:</p>
          <h1 style="color: #10b981; letter-spacing: 5px;">${otp}</h1>
          <p>It will expire in <strong>10 minutes</strong>.</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
      `,
    });

    res.json({ message: "OTP sent to email successfully." });
  } catch (err) {
    console.error("❌ Error in forgotPassword:", err);
    res.status(500).json({ 
      error: "An error occurred while trying to send the reset email." 
    });
  }
};

// --------------------
// VERIFY OTP (signup or forgot-password)
// --------------------
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp, action } = req.body;
    
    console.log("🔍 OTP verification attempt:", { email, action });

    if (!email || !otp) {
      return res.status(400).json({ error: "Email and OTP are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() })
      .select('+otp +otpExpiry +isVerified +password +role');
    
    if (!user || !user.otp || !user.otpExpiry) {
      return res.status(400).json({ error: "Invalid OTP request." });
    }

    if (user.otpExpiry < new Date()) {
      return res.status(400).json({ error: "OTP has expired" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    if (action === "signup") {
      user.isVerified = true;
      user.otp = undefined;
      user.otpExpiry = undefined;
      await user.save();

      console.log("✅ User verified:", email);

      // Generate token and log user in
      const token = jwt.sign(
        { id: user._id, role: user.role }, 
        process.env.JWT_SECRET, 
        { expiresIn: "7d" }
      );

      return res.json({
        message: "Account verified successfully",
        token,
        user: {
          id: user._id,
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role
        }
      });
    }

    // For forgot password flow - just verify OTP
    return res.json({ 
      message: "OTP verified successfully",
      email: user.email 
    });
    
  } catch (err) {
    console.error("❌ Error in verifyOtp:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// --------------------
// RESET PASSWORD
// --------------------
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ 
        error: "Password must be at least 6 characters" 
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() })
      .select('+otp +otpExpiry +password');
    
    if (!user || !user.otp || !user.otpExpiry) {
      return res.status(400).json({ error: "Invalid OTP request." });
    }

    if (user.otpExpiry < new Date()) {
      return res.status(400).json({ error: "OTP has expired" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    // Set new password
    user.password = newPassword;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    console.log("✅ Password reset successful:", email);

    res.json({ message: "Password reset successfully" });
  } catch (err) {
    console.error("❌ resetPassword error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
