const Candidate = require('../models/Candidate');
const JobDescription = require('../models/JobDescription');
const Feedback = require('../models/Feedback');
const matchingService = require('../services/matchingService');
const aiService = require('../services/aiService');

// @desc    Get matched candidates for a JD
// @route   GET /api/match
// @access  Private
exports.getMatches = async (req, res, next) => {
  try {
    const { jd_id, min_score, status } = req.query;

    if (!jd_id) {
      return res.status(400).json({
        success: false,
        message: 'JD ID is required'
      });
    }

    // Verify JD belongs to user
    const jd = await JobDescription.findOne({ _id: jd_id, user: req.user.id });
    if (!jd) {
      return res.status(404).json({
        success: false,
        message: 'Job description not found'
      });
    }

    const query = { jd_id, user: req.user.id };
    
    if (min_score) {
      query.match_score = { $gte: parseInt(min_score) };
    }

    if (status) {
      query.status = status;
    }

    const candidates = await Candidate.find(query)
      .sort({ match_score: -1 })
      .select('-raw_resume_text -embedding_vector');

    const formattedCandidates = candidates.map(c => ({
      candidate_id: c._id,
      name: c.name,
      email: c.email,
      match_score: c.match_score,
      matched_skills: c.matched_skills,
      missing_skills: c.missing_skills,
      summary: c.summary,
      status: c.status,
      experience_years: c.experience_years
    }));

    res.status(200).json({
      success: true,
      data: {
        jd_id,
        candidates: formattedCandidates
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Refresh match scores
// @route   POST /api/match/refresh
// @access  Private
exports.refreshMatches = async (req, res, next) => {
  try {
    const { jd_id } = req.body;

    if (!jd_id) {
      return res.status(400).json({
        success: false,
        message: 'JD ID is required'
      });
    }

    // Verify JD belongs to user
    const jd = await JobDescription.findOne({ _id: jd_id, user: req.user.id });
    if (!jd) {
      return res.status(404).json({
        success: false,
        message: 'Job description not found'
      });
    }

    const candidates = await matchingService.recalculateMatches(jd_id);

    res.status(200).json({
      success: true,
      data: {
        jd_id,
        recalculated: true,
        updated_candidates: candidates.length
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Explain match
// @route   POST /api/match/explain
// @access  Private
exports.explainMatch = async (req, res, next) => {
  try {
    const { jd_id, candidate_id } = req.body;

    if (!jd_id || !candidate_id) {
      return res.status(400).json({
        success: false,
        message: 'JD ID and Candidate ID are required'
      });
    }

    const jd = await JobDescription.findOne({ _id: jd_id, user: req.user.id });
    const candidate = await Candidate.findOne({ _id: candidate_id, user: req.user.id });

    if (!jd || !candidate) {
      return res.status(404).json({
        success: false,
        message: 'JD or Candidate not found'
      });
    }

    const explanation = aiService.explainMatch(candidate, jd);

    res.status(200).json({
      success: true,
      data: explanation
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit feedback
// @route   POST /api/feedback
// @access  Private
exports.submitFeedback = async (req, res, next) => {
  try {
    const { jd_id, candidate_id, action, notes } = req.body;

    if (!jd_id || !candidate_id || !action) {
      return res.status(400).json({
        success: false,
        message: 'JD ID, Candidate ID, and action are required'
      });
    }

    // Verify candidate belongs to user
    const candidate = await Candidate.findOne({ _id: candidate_id, user: req.user.id });
    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: 'Candidate not found'
      });
    }

    // Create feedback
    await Feedback.create({
      user: req.user.id,
      jd_id,
      candidate_id,
      action,
      notes
    });

    // Update candidate status
    candidate.status = action;

    // Update feedback weight
    candidate.feedback_weight = matchingService.updateFeedbackWeight(
      candidate.feedback_weight,
      action
    );

    await candidate.save();

    // Recalculate match score with new weight
    await matchingService.calculateMatch(candidate_id, jd_id);

    res.status(201).json({
      success: true,
      message: 'Feedback saved'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get feedback history
// @route   GET /api/feedback
// @access  Private
exports.getFeedback = async (req, res, next) => {
  try {
    const { jd_id, candidate_id } = req.query;

    const query = { user: req.user.id };
    
    if (jd_id) {
      query.jd_id = jd_id;
    }

    if (candidate_id) {
      query.candidate_id = candidate_id;
    }

    const feedbacks = await Feedback.find(query)
      .sort({ createdAt: -1 })
      .populate('jd_id', 'role')
      .populate('candidate_id', 'name email');

    res.status(200).json({
      success: true,
      data: {
        items: feedbacks
      }
    });
  } catch (error) {
    next(error);
  }
};
