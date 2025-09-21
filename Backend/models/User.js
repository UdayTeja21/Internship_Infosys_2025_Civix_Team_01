
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: [true, "Full name is required"], trim: true },
  email: { type: String, required: [true, "Email is required"], unique: true, lowercase: true, trim: true },
  password: { type: String, required: [true, "Password is required"], minlength: 6, select: false },
  role: { type: String, enum: ["citizen", "official"], default: "citizen" },
  profilePic: { type: String, default: null },
  otp: { type: String, select: false },
  otpExpiry: { type: Date, select: false }
}, { 
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.password;
      delete ret.__v;
      ret.id = ret._id;
      delete ret._id;
    }
  }
});

// This hook automatically converts the role to lowercase before saving
userSchema.pre("save", function (next) {
  if (this.isModified("role") || this.isNew) {
    this.role = this.role.toLowerCase();
  }
  next();
});

// This hook automatically hashes the password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const User = mongoose.model("User", userSchema);
export default User;
