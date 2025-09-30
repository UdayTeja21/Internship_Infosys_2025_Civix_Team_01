// // // import mongoose from 'mongoose';

// // // const signatureSchema = new mongoose.Schema({
// // //   user: {
// // //     type: mongoose.Schema.Types.ObjectId,
// // //     ref: 'User',
// // //     required: true
// // //   },
// // //   signedAt: {
// // //     type: Date,
// // //     default: Date.now
// // //   }
// // // });

// // // const petitionSchema = new mongoose.Schema({
// // //   title: {
// // //     type: String,
// // //     required: true,
// // //     trim: true,
// // //     maxlength: 200
// // //   },
// // //   description: {
// // //     type: String,
// // //     required: true,
// // //     maxlength: 5000
// // //   },
// // //   category: {
// // //     type: String,
// // //     required: true,
// // //     enum: ['environment', 'infrastructure', 'education', 'public-safety', 'transportation', 'healthcare', 'housing', 'government', 'community', 'other']
// // //   },
// // //   location: {
// // //     type: String,
// // //     required: true,
// // //     trim: true
// // //   },
// // //   creator: {
// // //     type: mongoose.Schema.Types.ObjectId,
// // //     ref: 'User',
// // //     required: true
// // //   },
// // //   signatures: [signatureSchema],
// // //   status: {
// // //     type: String,
// // //     enum: ['active', 'under_review', 'closed'],
// // //     default: 'active'
// // //   },
// // //   signatureGoal: {
// // //     type: Number,
// // //     default: 100,
// // //     min: 1
// // //   }
// // // }, {
// // //   timestamps: true
// // // });

// // // // Virtual for signature count
// // // petitionSchema.virtual('signatureCount').get(function() {
// // //   return this.signatures.length;
// // // });

// // // petitionSchema.set('toJSON', { virtuals: true });

// // // // Create and export the model
// // // const Petition = mongoose.model("Petition", petitionSchema);
// // // export default Petition;







// // import mongoose from 'mongoose';

// // const signatureSchema = new mongoose.Schema({
// //   user: {
// //     type: mongoose.Schema.Types.ObjectId,
// //     ref: 'User',
// //     required: true
// //   },
// //   signedAt: {
// //     type: Date,
// //     default: Date.now
// //   }
// // });

// // const petitionSchema = new mongoose.Schema({
// //   title: {
// //     type: String,
// //     required: true,
// //     trim: true,
// //     maxlength: 200
// //   },
// //   description: {
// //     type: String,
// //     required: true,
// //     maxlength: 5000
// //   },
// //   category: {
// //     type: String,
// //     required: true,
// //     enum: ['environment', 'infrastructure', 'education', 'public-safety', 'transportation', 'healthcare', 'housing', 'government', 'community', 'other']
// //   },
// //   location: {
// //     type: String,
// //     required: true,
// //     trim: true
// //   },
// //   creator: {
// //     type: mongoose.Schema.Types.ObjectId,
// //     ref: 'User',
// //     required: true
// //   },
// //   signatures: [signatureSchema],
// //   status: {
// //     type: String,
// //     enum: ['active', 'under_review', 'closed'],
// //     default: 'active'
// //   },
// //   signatureGoal: {
// //     type: Number,
// //     default: 100,
// //     min: 1
// //   }
// // }, {
// //   timestamps: true
// // });

// // // Virtual for signature count
// // petitionSchema.virtual('signatureCount').get(function() {
// //   return this.signatures.length;
// // });

// // // Virtual for progress percentage
// // petitionSchema.virtual('progress').get(function() {
// //   return Math.min(100, Math.round((this.signatures.length / this.signatureGoal) * 100));
// // });

// // petitionSchema.set('toJSON', { virtuals: true });

// // // Add to your existing Petition model
// // petitionSchema.virtual('daysActive').get(function() {
// //   const created = new Date(this.createdAt);
// //   const now = new Date();
// //   return Math.floor((now - created) / (1000 * 60 * 60 * 24));
// // });

// // // Method to check if goal is reached
// // petitionSchema.methods.isGoalReached = function() {
// //   return this.signatures.length >= this.signatureGoal;
// // };

// // // Method to get signature progress
// // petitionSchema.methods.getProgress = function() {
// //   return Math.min(100, Math.round((this.signatures.length / this.signatureGoal) * 100));
// // };

// // // Create and export the model
// // const Petition = mongoose.model("Petition", petitionSchema);
// // export default Petition;




// import mongoose from 'mongoose';

// const signatureSchema = new mongoose.Schema({
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   signedAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// const petitionSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: true,
//     trim: true,
//     maxlength: 200
//   },
//   description: {
//     type: String,
//     required: true,
//     maxlength: 5000
//   },
//   category: {
//     type: String,
//     required: true,
//     enum: ['environment', 'infrastructure', 'education', 'public-safety', 'transportation', 'healthcare', 'housing', 'government', 'community', 'other']
//   },
//   location: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   creator: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   signatures: [signatureSchema],
//   status: {
//     type: String,
//     enum: ['active', 'pending', 'under-review', 'under-consideration', 'approved', 'rejected', 'responded', 'closed'],
//     default: 'active'
//   },
//   signatureGoal: {
//     type: Number,
//     default: 100,
//     min: 1
//   },
//   officialResponse: {
//     message: { type: String },
//     respondedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//     respondedAt: { type: Date }
//   }
// }, {
//   timestamps: true
// });

// // Virtual for signature count
// petitionSchema.virtual('signatureCount').get(function() {
//   return this.signatures.length;
// });

// // Virtual for progress percentage
// petitionSchema.virtual('progress').get(function() {
//   if (this.signatureGoal === 0) return 0;
//   return Math.min(100, Math.round((this.signatures.length / this.signatureGoal) * 100));
// });

// // Virtual for how many days the petition has been active
// petitionSchema.virtual('daysActive').get(function() {
//   const created = new Date(this.createdAt);
//   const now = new Date();
//   return Math.floor((now - created) / (1000 * 60 * 60 * 24));
// });

// // Method to check if the signature goal has been reached
// petitionSchema.methods.isGoalReached = function() {
//   return this.signatures.length >= this.signatureGoal;
// };

// // Ensure virtuals are included when converting to JSON
// petitionSchema.set('toJSON', { virtuals: true });

// const Petition = mongoose.model("Petition", petitionSchema);

// export default Petition;

import mongoose from 'mongoose';

// =================================================================
// 1. SIGNATURE SUB-DOCUMENT SCHEMA
// This defines the structure for a single signature.
// It's not a separate model, but a schema to be embedded in the Petition.
// =================================================================
const signatureSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  signedAt: {
    type: Date,
    default: Date.now
  }
});


// =================================================================
// 2. MAIN PETITION SCHEMA
// This defines the structure for a petition document in the database.
// =================================================================
const petitionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'A title is required.'],
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: [true, 'A description is required.'],
    maxlength: 5000
  },
  category: {
    type: String,
    required: [true, 'A category is required.'],
    enum: ['environment', 'infrastructure', 'education', 'public-safety', 'transportation', 'healthcare', 'housing', 'government', 'community', 'other']
  },
  location: {
    type: String,
    required: [true, 'A location is required.'],
    trim: true
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  signatures: [signatureSchema], // An array of signature sub-documents
  status: {
    type: String,
    enum: ['active', 'pending', 'under-review', 'under-consideration', 'approved', 'rejected', 'responded', 'closed'],
    default: 'active'
  },
  signatureGoal: {
    type: Number,
    default: 100,
    min: 1
  },
  officialResponse: {
    message: { type: String },
    respondedBy: { type: String }, // Storing name or title of the official
    respondedAt: { type: Date }
  }
}, {
  // SCHEMA OPTIONS
  // timestamps: true is crucial. It automatically adds createdAt and updatedAt fields.
  // This is what your dashboard charts need to function correctly.
  timestamps: true 
});


// =================================================================
// 3. VIRTUAL PROPERTIES
// These are fields that are calculated on the fly and not stored in the database.
// =================================================================

// Virtual for getting the signature count
petitionSchema.virtual('signatureCount').get(function() {
  return this.signatures.length;
});

// Virtual for calculating the progress towards the signature goal
petitionSchema.virtual('progress').get(function() {
  if (this.signatureGoal === 0) return 0;
  return Math.min(100, Math.round((this.signatures.length / this.signatureGoal) * 100));
});

// Virtual for calculating how many days the petition has been active
petitionSchema.virtual('daysActive').get(function() {
  const created = new Date(this.createdAt);
  const now = new Date();
  // Calculate difference in milliseconds and convert to days
  return Math.floor((now - created) / (1000 * 60 * 60 * 24));
});


// =================================================================
// 4. METHODS
// These are functions you can call on individual petition documents.
// =================================================================

// Method to check if the signature goal has been reached
petitionSchema.methods.isGoalReached = function() {
  return this.signatures.length >= this.signatureGoal;
};


// =================================================================
// 5. MODEL CREATION & EXPORT
// This compiles the schema into a model and exports it.
// We also ensure that virtual properties are included when the document is converted to JSON.
// =================================================================
petitionSchema.set('toJSON', { virtuals: true });
petitionSchema.set('toObject', { virtuals: true });

const Petition = mongoose.model("Petition", petitionSchema);

export default Petition;