const JobDescription = require('../models/JobDescription');
const Candidate = require('../models/Candidate');
const Feedback = require('../models/Feedback');

// @desc    Get dashboard overview
// @route   GET /api/analytics/overview
// @access  Private
exports.getOverview = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const [totalJDs, totalCandidates, totalShortlisted, totalHired, candidates] = await Promise.all([
      JobDescription.countDocuments({ user: userId }),
      Candidate.countDocuments({ user: userId }),
      Candidate.countDocuments({ user: userId, status: 'shortlisted' }),
      Candidate.countDocuments({ user: userId, status: 'hired' }),
      Candidate.find({ user: userId }).select('match_score')
    ]);

    // Calculate average match score
    const avgMatchScore = candidates.length > 0
      ? Math.round(candidates.reduce((sum, c) => sum + c.match_score, 0) / candidates.length)
      : 0;

    res.status(200).json({
      success: true,
      data: {
        total_jds: totalJDs,
        total_candidates: totalCandidates,
        total_shortlisted: totalShortlisted,
        total_hired: totalHired,
        average_match_score: avgMatchScore
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get match score distribution
// @route   GET /api/analytics/match-distribution
// @access  Private
exports.getMatchDistribution = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const candidates = await Candidate.find({ user: userId }).select('match_score');

    const buckets = [
      { range: '0-40', count: 0 },
      { range: '40-60', count: 0 },
      { range: '60-80', count: 0 },
      { range: '80-100', count: 0 }
    ];

    candidates.forEach(candidate => {
      const score = candidate.match_score;
      if (score < 40) buckets[0].count++;
      else if (score < 60) buckets[1].count++;
      else if (score < 80) buckets[2].count++;
      else buckets[3].count++;
    });

    res.status(200).json({
      success: true,
      data: {
        buckets
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get top skills
// @route   GET /api/analytics/top-skills
// @access  Private
exports.getTopSkills = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { filter = 'all' } = req.query;

    const query = { user: userId };
    
    if (filter === 'shortlisted') {
      query.status = 'shortlisted';
    } else if (filter === 'hired') {
      query.status = 'hired';
    }

    const candidates = await Candidate.find(query).select('skills');

    // Count skill occurrences
    const skillCount = {};
    candidates.forEach(candidate => {
      candidate.skills.forEach(skill => {
        skillCount[skill] = (skillCount[skill] || 0) + 1;
      });
    });

    // Sort and get top 10
    const sortedSkills = Object.entries(skillCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, count]) => ({ name, count }));

    res.status(200).json({
      success: true,
      data: {
        skills: sortedSkills
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get learning insights
// @route   GET /api/analytics/learning-insights
// @access  Private
exports.getLearningInsights = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const [shortlistedCandidates, hiredCandidates, topJDs] = await Promise.all([
      Candidate.find({ user: userId, status: 'shortlisted' })
        .select('skills experience_years'),
      Candidate.find({ user: userId, status: 'hired' })
        .select('skills experience_years'),
      JobDescription.find({ user: userId })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('role')
    ]);

    const insights = [];

    // Insight 1: Experience pattern
    if (shortlistedCandidates.length > 0) {
      const avgExp = Math.round(
        shortlistedCandidates.reduce((sum, c) => sum + (c.experience_years || 0), 0) / 
        shortlistedCandidates.length
      );
      if (avgExp > 0) {
        insights.push(
          `Most shortlisted candidates have around ${avgExp} years of experience.`
        );
      }
    }

    // Insight 2: Common skills in hired candidates
    if (hiredCandidates.length > 0) {
      const skillCount = {};
      hiredCandidates.forEach(c => {
        c.skills.forEach(skill => {
          skillCount[skill] = (skillCount[skill] || 0) + 1;
        });
      });
      
      const topSkill = Object.entries(skillCount)
        .sort((a, b) => b[1] - a[1])[0];
      
      if (topSkill) {
        const percentage = Math.round((topSkill[1] / hiredCandidates.length) * 100);
        insights.push(
          `${topSkill[0]} appears in ${percentage}% of hired candidates.`
        );
      }
    }

    // Insight 3: Recent hiring patterns
    if (topJDs.length > 0) {
      insights.push(
        `Currently focusing on ${topJDs[0].role} and related positions.`
        );
    }

    // Default insights if not enough data
    if (insights.length === 0) {
      insights.push(
        'Start analyzing more candidates to get personalized insights.',
        'Candidates with matching skills are 3x more likely to be shortlisted.',
        'Experience level plays a key role in final hiring decisions.'
      );
    }

    res.status(200).json({
      success: true,
      data: {
        insights
      }
    });
  } catch (error) {
    next(error);
  }
};
