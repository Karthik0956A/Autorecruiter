const express = require('express');
const router = express.Router();
const {
  getOverview,
  getMatchDistribution,
  getTopSkills,
  getLearningInsights
} = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');

router.get('/overview', protect, getOverview);
router.get('/match-distribution', protect, getMatchDistribution);
router.get('/top-skills', protect, getTopSkills);
router.get('/learning-insights', protect, getLearningInsights);

module.exports = router;
