const JobDescription = require('../models/JobDescription');
const aiService = require('../services/aiService');

// @desc    Analyze job description
// @route   POST /api/jd/analyze
// @access  Public/Private
exports.analyzeJD = async (req, res, next) => {
  try {
    const { jd_text } = req.body;

    if (!jd_text) {
      return res.status(400).json({
        success: false,
        message: 'Job description text is required'
      });
    }

    // Analyze JD using AI service
    const analysis = await aiService.analyzeJobDescription(jd_text);

    res.status(200).json({
      success: true,
      data: {
        ...analysis,
        raw_text: jd_text
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create job description
// @route   POST /api/jd
// @access  Private
exports.createJD = async (req, res, next) => {
  try {
    const { role, required_skills, good_to_have, experience_level, summary, raw_text } = req.body;

    const jd = await JobDescription.create({
      user: req.user.id,
      role,
      required_skills,
      good_to_have,
      experience_level,
      summary,
      raw_text
    });

    res.status(201).json({
      success: true,
      data: {
        jd_id: jd._id,
        message: 'JD created successfully'
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all job descriptions
// @route   GET /api/jd
// @access  Private
exports.getJDs = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search } = req.query;

    const query = { user: req.user.id };
    
    if (search) {
      query.$or = [
        { role: { $regex: search, $options: 'i' } },
        { required_skills: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const total = await JobDescription.countDocuments(query);
    const jds = await JobDescription.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-embedding_vector');

    res.status(200).json({
      success: true,
      data: {
        items: jds,
        page: parseInt(page),
        total
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single job description
// @route   GET /api/jd/:id
// @access  Private
exports.getJD = async (req, res, next) => {
  try {
    const jd = await JobDescription.findOne({
      _id: req.params.id,
      user: req.user.id
    }).select('-embedding_vector');

    if (!jd) {
      return res.status(404).json({
        success: false,
        message: 'Job description not found'
      });
    }

    res.status(200).json({
      success: true,
      data: jd
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update job description
// @route   PUT /api/jd/:id
// @access  Private
exports.updateJD = async (req, res, next) => {
  try {
    let jd = await JobDescription.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!jd) {
      return res.status(404).json({
        success: false,
        message: 'Job description not found'
      });
    }

    jd = await JobDescription.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).select('-embedding_vector');

    res.status(200).json({
      success: true,
      data: jd
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete job description
// @route   DELETE /api/jd/:id
// @access  Private
exports.deleteJD = async (req, res, next) => {
  try {
    const jd = await JobDescription.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!jd) {
      return res.status(404).json({
        success: false,
        message: 'Job description not found'
      });
    }

    await jd.deleteOne();

    res.status(200).json({
      success: true,
      message: 'JD deleted'
    });
  } catch (error) {
    next(error);
  }
};
