const express = require('express');
const router = express.Router();
const {
  uploadCandidates,
  parseResumeFile,
  getCandidates,
  getCandidate,
  updateCandidate,
  deleteCandidate
} = require('../controllers/candidateController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/upload', protect, uploadCandidates);
router.post('/parse-resume', protect, upload.single('file'), parseResumeFile);
router.get('/', protect, getCandidates);
router.get('/:id', protect, getCandidate);
router.put('/:id', protect, updateCandidate);
router.delete('/:id', protect, deleteCandidate);

module.exports = router;
