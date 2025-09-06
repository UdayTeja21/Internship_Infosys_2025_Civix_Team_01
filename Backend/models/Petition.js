import mongoose from "mongoose";

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
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [5000, 'Description cannot exceed 5000 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: ['environment', 'education', 'healthcare', 'transportation', 'housing', 'safety', 'government', 'community', 'other'],
      message: 'Invalid category'
    }
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
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
    enum: ['active', 'closed', 'draft'],
    default: 'active'
  },
  signatureGoal: {
    type: Number,
    default: 100,
    min: [1, 'Signature goal must be at least 1']
  }
}, {
  timestamps: true
});

// Virtual for signature count
petitionSchema.virtual('signatureCount').get(function() {
  return this.signatures.length;
});

// Ensure virtuals are included in JSON output
petitionSchema.set('toJSON', { virtuals: true });
petitionSchema.set('toObject', { virtuals: true });

// Indexes for better performance
petitionSchema.index({ category: 1, status: 1 });
petitionSchema.index({ location: 1, status: 1 });
petitionSchema.index({ creator: 1 });
petitionSchema.index({ createdAt: -1 });

// Pre-save middleware to validate data
petitionSchema.pre('save', function(next) {
  console.log('💾 Saving petition:', this.title);
  next();
});

export default mongoose.model("Petition", petitionSchema);