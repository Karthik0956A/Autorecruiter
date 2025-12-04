const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  jd_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JobDescription',
    required: true
  },
  candidate_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Candidate',
    required: true
  },
  action: {
    type: String,
    enum: ['viewed', 'shortlisted', 'rejected', 'hired'],
    required: true
  },
  notes: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
feedbackSchema.index({ user: 1, jd_id: 1 });
feedbackSchema.index({ candidate_id: 1 });

module.exports = mongoose.model('Feedback', feedbackSchema);
