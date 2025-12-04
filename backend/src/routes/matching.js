const express = require('express');
const router = express.Router();
const {
  getMatches,
  refreshMatches,
  explainMatch,
  submitFeedback,
  getFeedback
} = require('../controllers/matchController');
const { protect } = require('../middleware/auth');

router.get('/match', protect, getMatches);
router.post('/match/refresh', protect, refreshMatches);
router.post('/match/explain', protect, explainMatch);
router.post('/feedback', protect, submitFeedback);
router.get('/feedback', protect, getFeedback);

module.exports = router;
