const Candidate = require('../models/Candidate');
const JobDescription = require('../models/JobDescription');
const aiService = require('./aiService');

// Calculate match score for a candidate against a JD
exports.calculateMatch = async (candidateId, jdId) => {
  try {
    const candidate = await Candidate.findById(candidateId);
    const jd = await JobDescription.findById(jdId);

    if (!candidate || !jd) {
      throw new Error('Candidate or JD not found');
    }

    // Calculate base match score
    const baseScore = aiService.calculateMatchScore(
      candidate.skills,
      jd.required_skills,
      jd.good_to_have,
      candidate.experience_years,
      jd.experience_level
    );

    // Apply feedback weight
    const finalScore = Math.min(Math.round(baseScore * candidate.feedback_weight), 100);

    // Identify matched and missing skills
    const matched_skills = candidate.skills.filter(skill => 
      jd.required_skills.some(req => req.toLowerCase() === skill.toLowerCase()) ||
      jd.good_to_have.some(good => good.toLowerCase() === skill.toLowerCase())
    );

    const missing_skills = jd.required_skills.filter(req =>
      !candidate.skills.some(skill => skill.toLowerCase() === req.toLowerCase())
    );

    // Update candidate with match details
    candidate.match_score = finalScore;
    candidate.matched_skills = matched_skills;
    candidate.missing_skills = missing_skills;
    await candidate.save();

    return {
      candidate_id: candidate._id,
      name: candidate.name,
      email: candidate.email,
      match_score: finalScore,
      matched_skills,
      missing_skills,
      summary: candidate.summary,
      status: candidate.status,
      experience_years: candidate.experience_years
    };
  } catch (error) {
    throw error;
  }
};

// Recalculate matches for all candidates of a JD
exports.recalculateMatches = async (jdId) => {
  try {
    const candidates = await Candidate.find({ jd_id: jdId });
    const results = [];

    for (const candidate of candidates) {
      const matchResult = await this.calculateMatch(candidate._id, jdId);
      results.push(matchResult);
    }

    return results;
  } catch (error) {
    throw error;
  }
};

// Update feedback weight based on action
exports.updateFeedbackWeight = (currentWeight, action) => {
  const weights = {
    viewed: 1.02,      // +2%
    shortlisted: 1.15, // +15%
    rejected: 0.90,    // -10%
    hired: 1.40        // +40%
  };

  return currentWeight * (weights[action] || 1.0);
};

module.exports = exports;
