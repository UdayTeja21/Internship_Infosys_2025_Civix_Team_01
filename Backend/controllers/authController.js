// import bcrypt from "bcryptjs";
// import crypto from "crypto";
// import dotenv from "dotenv";
// import jwt from "jsonwebtoken";
// import nodemailer from "nodemailer";
// import User from "../models/User.js";

// // Load environment variables
// dotenv.config();

// // Signup Controller - FIXED
// export const signup = async (req, res) => {
//   console.log("📩 Signup request received:", req.body);
//   try {
//     const { fullName, email, password, role } = req.body;
//     if (!fullName || !email || !password) {
//       return res.status(400).json({ error: "All fields are required" });
//     }

//     let user = await User.findOne({ email });
//     if (user) {
//       return res.status(400).json({ error: "User already exists" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     user = new User({ fullName, email, password: hashedPassword, role });
//     await user.save();
    
//     // Generate token like in login
//     const token = jwt.sign(
//       { id: user._id, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: "1d" }
//     );
    
//     console.log("✅ User created successfully:", email);
    
//     // Return token and user data like login does
//     res.json({
//       token,
//       user: { 
//         id: user._id, 
//         fullName: user.fullName,
//         email: user.email, 
//         role: user.role 
//       },
//     });
//   } catch (err) {
//     console.error("❌ Signup error:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// };

// // Login Controller
// export const login = async (req, res) => {
//   console.log("🔑 Login request received:", req.body);
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ error: "Invalid credentials" });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

//     const token = jwt.sign(
//       { id: user._id, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: "1d" }
//     );

//     console.log("✅ Login successful:", email);
//     res.json({
//       token,
//       user: { 
//         id: user._id, 
//         fullName: user.fullName,
//         email: user.email, 
//         role: user.role 
//       },
//     });
//   } catch (err) {
//     console.error("❌ Login error:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// };

// // Generate OTP
// const generateOTP = () => {
//   return crypto.randomInt(100000, 999999).toString();
// };

// // Email transporter setup
// const createTransporter = () => {
//   if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
//     throw new Error("Email credentials not configured");
//   }

//   return nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS,
//     },
//   });
// };

// // Forgot Password Controller
// export const forgotPassword = async (req, res) => {
//   console.log("📧 Forgot password request:", req.body);
//   try {
//     const { email } = req.body;
    
//     if (!email) {
//       return res.status(400).json({ error: "Email is required" });
//     }

//     const user = await User.findOne({ email });
    
//     if (!user) {
//       console.log("❌ User not found for email:", email);
//       return res.status(404).json({ error: "User not found" });
//     }

//     // Generate OTP and set expiration (10 minutes)
//     const otp = generateOTP();
//     const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

//     user.otp = otp;
//     user.otpExpiry = otpExpiry;
//     await user.save();

//     console.log("📨 OTP generated for:", email, otp);

//     // For development/testing, return OTP in response
//     if (process.env.NODE_ENV === 'development' || !process.env.EMAIL_USER) {
//       console.log("🚧 Development mode: Returning OTP in response");
//       return res.json({ 
//         message: "OTP generated (development mode)",
//         otp: otp,
//         email: email,
//         note: "In production, this would be sent via email"
//       });
//     }

//     // Send email with OTP (production)
//     try {
//       const transporter = createTransporter();
//       await transporter.verify();

//       const mailOptions = {
//         from: process.env.EMAIL_USER,
//         to: email,
//         subject: 'Password Reset OTP - CIVIX',
//         html: `
//           <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//             <h2 style="color: #4CAF50;">Password Reset Request</h2>
//             <p>Hello ${user.fullName},</p>
//             <p>Your OTP for password reset is: <strong style="font-size: 18px; color: #4CAF50;">${otp}</strong></p>
//             <p>This OTP will expire in 10 minutes.</p>
//             <p>If you didn't request this, please ignore this email.</p>
//             <br>
//             <p>Best regards,<br>CIVIX Team</p>
//           </div>
//         `
//       };

//       const info = await transporter.sendMail(mailOptions);
//       console.log("✅ OTP email sent to:", email);
      
//       res.json({ 
//         message: "OTP sent to email",
//         email: email
//       });
//     } catch (emailError) {
//       console.error("❌ Email sending error:", emailError);
//       return res.json({ 
//         message: "OTP generated (email failed)",
//         otp: otp,
//         email: email,
//         error: "Email service temporarily unavailable"
//       });
//     }
//   } catch (err) {
//     console.error("❌ Forgot password error:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// };

// // Reset Password Controller
// export const resetPassword = async (req, res) => {
//   console.log("🔄 Reset password request:", req.body);
//   try {
//     const { email, otp, newPassword } = req.body;

//     if (!email || !otp || !newPassword) {
//       return res.status(400).json({ error: "All fields are required" });
//     }

//     if (newPassword.length < 6) {
//       return res.status(400).json({ error: "Password must be at least 6 characters" });
//     }

//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     // Check if OTP matches and is not expired
//     if (user.otp !== otp) {
//       return res.status(400).json({ error: "Invalid OTP" });
//     }

//     if (user.otpExpiry < new Date()) {
//       return res.status(400).json({ error: "OTP has expired" });
//     }

//     // Hash new password and update user
//     const hashedPassword = await bcrypt.hash(newPassword, 10);
//     user.password = hashedPassword;
//     user.otp = undefined;
//     user.otpExpiry = undefined;
//     await user.save();

//     console.log("✅ Password reset successful for:", email);
//     res.json({ message: "Password reset successfully" });
//   } catch (err) {
//     console.error("❌ Reset password error:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// };

// // Verify OTP Controller
// export const verifyOtp = async (req, res) => {
//   console.log("🔍 Verify OTP request:", req.body);
//   try {
//     const { email, otp } = req.body;

//     if (!email || !otp) {
//       return res.status(400).json({ error: "Email and OTP are required" });
//     }

//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     // Check if OTP matches and is not expired
//     if (user.otp !== otp) {
//       return res.status(400).json({ error: "Invalid OTP" });
//     }

//     if (user.otpExpiry < new Date()) {
//       return res.status(400).json({ error: "OTP has expired" });
//     }

//     console.log("✅ OTP verified for:", email);
//     res.json({ message: "OTP verified successfully" });
//   } catch (err) {
//     console.error("❌ Verify OTP error:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// };
import bcrypt from "bcryptjs";
import crypto from "crypto";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import User from "../models/User.js";

// Load environment variables
dotenv.config();

// Signup Controller
export const signup = async (req, res) => {
  console.log("📩 Signup request received:", req.body);
  try {
    const { fullName, email, password, role } = req.body;
    if (!fullName || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({ fullName, email, password: hashedPassword, role });
    await user.save();
    
    // Generate token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    
    console.log("✅ User created successfully:", email);
    
    res.json({
      token,
      user: { 
        id: user._id, 
        fullName: user.fullName,
        email: user.email, 
        role: user.role 
      },
    });
  } catch (err) {
    console.error("❌ Signup error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Login Controller with debug logging
export const login = async (req, res) => {
  console.log("🔑 Login request received:", req.body);
  try {
    const { email, password } = req.body;
    console.log("🔍 Looking for user with email:", email);
    
    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ User not found for email:", email);
      return res.status(400).json({ error: "Invalid credentials" });
    }

    console.log("🔍 User found, comparing passwords...");
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("❌ Password doesn't match");
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    console.log("✅ Login successful:", email);
    res.json({
      token,
      user: { 
        id: user._id, 
        fullName: user.fullName,
        email: user.email, 
        role: user.role 
      },
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Generate OTP
const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

// Email transporter setup
const createTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error("Email credentials not configured");
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Forgot Password Controller - UPDATED
export const forgotPassword = async (req, res) => {
  console.log("📧 Forgot password request:", req.body);
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const user = await User.findOne({ email });
    
    // For security, don't reveal if user exists or not
    if (!user) {
      console.log("❌ User not found for email:", email);
      // Still return success to prevent email enumeration
      return res.json({ 
        message: "If this email is registered, you will receive OTP shortly" 
      });
    }

    // Generate OTP and set expiration (10 minutes)
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    console.log("📨 OTP generated for:", email, otp);

    // Send email with OTP
    try {
      const transporter = createTransporter();
      await transporter.verify();

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Password Reset OTP - CIVIX',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #4CAF50;">Password Reset Request</h2>
            <p>Hello ${user.fullName},</p>
            <p>Your OTP for password reset is: <strong style="font-size: 18px; color: #4CAF50;">${otp}</strong></p>
            <p>This OTP will expire in 10 minutes.</p>
            <p>If you didn't request this, please ignore this email.</p>
            <br>
            <p>Best regards,<br>CIVIX Team</p>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
      console.log("✅ OTP email sent to:", email);
      
      res.json({ 
        message: "OTP sent to email"
      });
    } catch (emailError) {
      console.error("❌ Email sending error:", emailError);
      return res.status(500).json({ 
        error: "Failed to send email. Please try again later." 
      });
    }
  } catch (err) {
    console.error("❌ Forgot password error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Reset Password Controller
export const resetPassword = async (req, res) => {
  console.log("🔄 Reset password request:", req.body);
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if OTP matches and is not expired
    if (user.otp !== otp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    if (user.otpExpiry < new Date()) {
      return res.status(400).json({ error: "OTP has expired" });
    }

    // Hash new password and update user
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    console.log("✅ Password reset successful for:", email);
    res.json({ message: "Password reset successfully" });
  } catch (err) {
    console.error("❌ Reset password error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Verify OTP Controller
export const verifyOtp = async (req, res) => {
  console.log("🔍 Verify OTP request:", req.body);
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: "Email and OTP are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if OTP matches and is not expired
    if (user.otp !== otp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    if (user.otpExpiry < new Date()) {
      return res.status(400).json({ error: "OTP has expired" });
    }

    console.log("✅ OTP verified for:", email);
    res.json({ message: "OTP verified successfully" });
  } catch (err) {
    console.error("❌ Verify OTP error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Debug route to check all users
export const debugUsers = async (req, res) => {
  try {
    const users = await User.find({});
    console.log("All users in database:", users);
    res.json({ count: users.length, users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: error.message });
  }
};

// Test route for login functionality
export const testLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Test login with:", { email, password });
    
    // Test bcrypt
    const testHash = await bcrypt.hash("test123", 10);
    const testMatch = await bcrypt.compare("test123", testHash);
    
    res.json({
      message: "Test successful",
      bcryptWorking: testMatch,
      received: { email, password }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};