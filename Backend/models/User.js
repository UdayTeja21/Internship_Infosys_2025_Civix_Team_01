
// // // import mongoose from 'mongoose';

// // // const userSchema = new mongoose.Schema({
// // //   fullName: {
// // //     type: String,
// // //     required: true,
// // //     trim: true
// // //   },
// // //   email: {
// // //     type: String,
// // //     required: true,
// // //     unique: true,
// // //     lowercase: true,
// // //     trim: true
// // //   },
// // //   password: {
// // //     type: String,
// // //     required: true,
// // //     minlength: 6
// // //   },
// // //   role: {
// // //     type: String,
// // //     enum: ["citizen", "official"],
// // //     default: "citizen"
// // //   },
// // //   // Add OTP fields for password reset
// // //   otp: {
// // //     type: String,
// // //     default: null
// // //   },
// // //   otpExpiry: {
// // //     type: Date,
// // //     default: null
// // //   }
// // // }, {
// // //   timestamps: true
// // // });

// // // // Remove password when converting to JSON
// // // userSchema.methods.toJSON = function() {
// // //   const user = this.toObject();
// // //   delete user.password;
// // //   delete user.otp;
// // //   delete user.otpExpiry;
// // //   return user;
// // // };

// // // // Create and export the model
// // // const User = mongoose.model("User", userSchema);
// // // export default User;
// // import bcrypt from "bcryptjs";
// // import mongoose from "mongoose";

// // const userSchema = new mongoose.Schema({
// //   fullName: { type: String, required: true, trim: true },
// //   email: { type: String, required: true, unique: true, lowercase: true, trim: true },
// //   password: { type: String, required: true, minlength: 6 },
// //   role: { type: String, enum: ["citizen", "official"], default: "citizen" },
// //   otp: { type: String, default: null },
// //   otpExpiry: { type: Date, default: null }
// // }, { timestamps: true });

// // // Hash password before save
// // userSchema.pre("save", async function (next) {
// //   if (!this.isModified("password")) return next();
// //   this.password = await bcrypt.hash(this.password, 10);
// //   next();
// // });

// // // Hide sensitive fields
// // userSchema.methods.toJSON = function () {
// //   const obj = this.toObject();
// //   delete obj.password;
// //   delete obj.otp;
// //   delete obj.otpExpiry;
// //   return obj;
// // };

// // const User = mongoose.model("User", userSchema);
// // export default User;



// // User.js
// import bcrypt from "bcryptjs";
// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema({
//   fullName: { type: String, required: true, trim: true },
//   email: { type: String, required: true, unique: true, lowercase: true, trim: true },
//   password: { type: String, required: true, minlength: 6 },
//   role: { type: String, enum: ["citizen", "official"], default: "citizen" },
//   otp: { type: String, default: null },
//   otpExpiry: { type: Date, default: null }
// }, { timestamps: true });

// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();
//   this.password = await bcrypt.hash(this.password, 10);
//   next();
// });

// userSchema.methods.toJSON = function () {
//   const obj = this.toObject();
//   delete obj.password;
//   delete obj.otp;
//   delete obj.otpExpiry;
//   return obj;
// };

// const User = mongoose.model("User", userSchema);
// export default User;


// models/User.js



// import bcrypt from "bcryptjs";
// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema({
//   fullName: { type: String, required: true, trim: true },
//   email: { type: String, required: true, unique: true, lowercase: true, trim: true },
//   password: { type: String, required: true, minlength: 6 },
//   role: { type: String, enum: ["citizen", "official"], default: "citizen" },
  
//   // ✅ ADD THIS LINE
//   profilePic: { type: String, default: null },

//   otp: { type: String, default: null },
//   otpExpiry: { type: Date, default: null }
// }, { timestamps: true });

// // This hook automatically hashes the password before saving
// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();
//   this.password = await bcrypt.hash(this.password, 10);
//   next();
// });

// // This method removes sensitive data when sending the user object to the frontend
// userSchema.methods.toJSON = function () {
//   const obj = this.toObject();
//   delete obj.password;
//   delete obj.otp;
//   delete obj.otpExpiry;
//   return obj;
// };

// const User = mongoose.model("User", userSchema);
// export default User;



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
