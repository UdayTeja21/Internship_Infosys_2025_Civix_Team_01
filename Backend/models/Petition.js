import mongoose from 'mongoose';

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

const petitionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    maxlength: 5000
  },
  category: {
    type: String,
    required: true,
    enum: ['environment', 'infrastructure', 'education', 'public-safety', 'transportation', 'healthcare', 'housing', 'government', 'community', 'other']
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  signatures: [signatureSchema],
  status: {
    type: String,
    enum: ['active', 'under_review', 'closed'],
    default: 'active'
  },
  signatureGoal: {
    type: Number,
    default: 100,
    min: 1
  }
}, {
  timestamps: true
});

// Virtual for signature count
petitionSchema.virtual('signatureCount').get(function() {
  return this.signatures.length;
});

// Virtual for progress percentage
petitionSchema.virtual('progress').get(function() {
  return Math.min(100, Math.round((this.signatures.length / this.signatureGoal) * 100));
});

petitionSchema.set('toJSON', { virtuals: true });

// Add to your existing Petition model
petitionSchema.virtual('daysActive').get(function() {
  const created = new Date(this.createdAt);
  const now = new Date();
  return Math.floor((now - created) / (1000 * 60 * 60 * 24));
});

// Method to check if goal is reached
petitionSchema.methods.isGoalReached = function() {
  return this.signatures.length >= this.signatureGoal;
};

// Method to get signature progress
petitionSchema.methods.getProgress = function() {
  return Math.min(100, Math.round((this.signatures.length / this.signatureGoal) * 100));
};

// Create and export the model
const Petition = mongoose.model("Petition", petitionSchema);
export default Petition;