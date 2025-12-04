const mongoose = require('mongoose');

const jobDescriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  role: {
    type: String,
    required: true
  },
  required_skills: [{
    type: String
  }],
  good_to_have: [{
    type: String
  }],
  experience_level: {
    type: String
  },
  summary: {
    type: String
  },
  raw_text: {
    type: String,
    required: true
  },
  embedding_vector: [{
    type: Number
  }],
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
jobDescriptionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('JobDescription', jobDescriptionSchema);
