// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema({
//   fullName: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//     lowercase: true,
//     trim: true
//   },
//   password: {
//     type: String,
//     required: true,
//     minlength: 6
//   },
//   role: {
//     type: String,
//     enum: ['citizen', 'official'],
//     default: 'citizen'
//   },
//   otp: String,
//   otpExpiry: Date,
//   location: {
//     type: String,
//     trim: true
//   }
// }, {
//   timestamps: true
// });

// export default mongoose.model("User", userSchema);




// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ["Citizen", "Public Official"],
    default: "Citizen"
  },
  otp: {
    type: String,
    default: null
  },
  otpExpiry: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Remove password when converting to JSON
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

export default mongoose.model("User", userSchema);


// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema({
//   fullName: { 
//     type: String, 
//     required: true,
//     trim: true
//   },
//   email: { 
//     type: String, 
//     required: true, 
//     unique: true,
//     lowercase: true,
//     trim: true
//   },
//   password: { 
//     type: String, 
//     required: true 
//   },
//   role: { 
//     type: String, 
//     enum: ["Citizen", "Public Official"], 
//     default: "Citizen" 
//   },
//   otp: {
//     type: String,
//     default: null
//   },
//   otpExpiry: {
//     type: Date,
//     default: null
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// // Index for better performance
// userSchema.index({ email: 1 });
// userSchema.index({ otpExpiry: 1 }, { expireAfterSeconds: 0 }); // Auto-clean expired OTPs

// export default mongoose.model("User", userSchema);