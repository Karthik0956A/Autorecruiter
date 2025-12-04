const express = require('express');
const router = express.Router();
const {
  analyzeJD,
  createJD,
  getJDs,
  getJD,
  updateJD,
  deleteJD
} = require('../controllers/jdController');
const { protect } = require('../middleware/auth');

router.post('/analyze', analyzeJD);
router.post('/', protect, createJD);
router.get('/', protect, getJDs);
router.get('/:id', protect, getJD);
router.put('/:id', protect, updateJD);
router.delete('/:id', protect, deleteJD);

module.exports = router;
