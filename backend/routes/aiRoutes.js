const express = require('express');
const router = express.Router();
const {
  generateQuiz,
  chatWithTutor,
  generateLearningPath,
  explainConcept
} = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

// All AI routes are protected - user must be logged in
router.post('/generate-quiz', protect, generateQuiz);
router.post('/chat', protect, chatWithTutor);
router.post('/learning-path', protect, generateLearningPath);
router.post('/explain', protect, explainConcept);

module.exports = router;