const Candidate = require('../models/Candidate');
const JobDescription = require('../models/JobDescription');
const { parseResume, extractCandidateInfo } = require('../utils/resumeParser');
const aiService = require('../services/aiService');
const matchingService = require('../services/matchingService');
const fs = require('fs').promises;

// @desc    Upload candidates with resumes
// @route   POST /api/candidates/upload
// @access  Private
exports.uploadCandidates = async (req, res, next) => {
  try {
    const { jd_id, candidates } = req.body;

    if (!jd_id || !candidates || !Array.isArray(candidates)) {
      return res.status(400).json({
        success: false,
        message: 'JD ID and candidates array are required'
      });
    }

    // Verify JD exists and belongs to user
    const jd = await JobDescription.findOne({ _id: jd_id, user: req.user.id });
    if (!jd) {
      return res.status(404).json({
        success: false,
        message: 'Job description not found'
      });
    }

    const savedCandidates = [];

    for (const candidateData of candidates) {
      const { name, email, phone, resume_text } = candidateData;

      // Extract skills and info from resume
      const extractedInfo = extractCandidateInfo(resume_text);
      const skills = await aiService.extractSkillsFromResume(resume_text);
      
      // Generate summary
      const summary = await aiService.generateCandidateSummary({
        name: name || extractedInfo.name,
        experience_years: extractedInfo.experience_years,
        skills
      });

      // Create candidate
      const candidate = await Candidate.create({
        user: req.user.id,
        jd_id,
        name: name || extractedInfo.name || 'Unknown',
        email: email || extractedInfo.email || 'noemail@example.com',
        phone: phone || extractedInfo.phone,
        raw_resume_text: resume_text,
        skills,
        experience_years: extractedInfo.experience_years,
        summary
      });

      // Calculate match score
      await matchingService.calculateMatch(candidate._id, jd_id);

      savedCandidates.push(candidate);
    }

    res.status(201).json({
      success: true,
      data: {
        saved_count: savedCandidates.length,
        jd_id
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Parse resume file
// @route   POST /api/candidates/parse-resume
// @access  Private
exports.parseResumeFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // Parse resume
    const resumeText = await parseResume(req.file.path, req.file.mimetype);
    
    // Extract info
    const extractedInfo = extractCandidateInfo(resumeText);
    const skills = await aiService.extractSkillsFromResume(resumeText);

    // Delete uploaded file
    await fs.unlink(req.file.path);

    res.status(200).json({
      success: true,
      data: {
        name: extractedInfo.name || '',
        email: extractedInfo.email || '',
        phone: extractedInfo.phone || '',
        resume_text: resumeText,
        skills,
        experience_years: extractedInfo.experience_years || 0
      }
    });
  } catch (error) {
    // Clean up file on error
    if (req.file) {
      await fs.unlink(req.file.path).catch(console.error);
    }
    next(error);
  }
};

// @desc    Get all candidates
// @route   GET /api/candidates
// @access  Private
exports.getCandidates = async (req, res, next) => {
  try {
    const { jd_id, search, status, page = 1, limit = 20 } = req.query;

    const query = { user: req.user.id };
    
    if (jd_id) {
      query.jd_id = jd_id;
    }

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { skills: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const total = await Candidate.countDocuments(query);
    const candidates = await Candidate.find(query)
      .sort({ match_score: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-raw_resume_text -embedding_vector');

    res.status(200).json({
      success: true,
      data: {
        items: candidates,
        page: parseInt(page),
        total
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single candidate
// @route   GET /api/candidates/:id
// @access  Private
exports.getCandidate = async (req, res, next) => {
  try {
    const candidate = await Candidate.findOne({
      _id: req.params.id,
      user: req.user.id
    }).select('-embedding_vector');

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: 'Candidate not found'
      });
    }

    res.status(200).json({
      success: true,
      data: candidate
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update candidate
// @route   PUT /api/candidates/:id
// @access  Private
exports.updateCandidate = async (req, res, next) => {
  try {
    let candidate = await Candidate.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: 'Candidate not found'
      });
    }

    candidate = await Candidate.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).select('-embedding_vector');

    res.status(200).json({
      success: true,
      data: candidate
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete candidate
// @route   DELETE /api/candidates/:id
// @access  Private
exports.deleteCandidate = async (req, res, next) => {
  try {
    const candidate = await Candidate.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: 'Candidate not found'
      });
    }

    await candidate.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Candidate deleted'
    });
  } catch (error) {
    next(error);
  }
};
