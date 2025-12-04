const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  jd_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JobDescription'
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String
  },
  raw_resume_text: {
    type: String,
    required: true
  },
  skills: [{
    type: String
  }],
  experience_years: {
    type: Number
  },
  education: {
    type: String
  },
  projects: [{
    title: String,
    description: String
  }],
  embedding_vector: [{
    type: Number
  }],
  match_score: {
    type: Number,
    default: 0
  },
  matched_skills: [{
    type: String
  }],
  missing_skills: [{
    type: String
  }],
  summary: {
    type: String
  },
  status: {
    type: String,
    enum: ['none', 'viewed', 'shortlisted', 'rejected', 'hired'],
    default: 'none'
  },
  feedback_weight: {
    type: Number,
    default: 1.0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on save
candidateSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for faster queries
candidateSchema.index({ user: 1, jd_id: 1 });
candidateSchema.index({ status: 1 });
candidateSchema.index({ match_score: -1 });

module.exports = mongoose.model('Candidate', candidateSchema);
