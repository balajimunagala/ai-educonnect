const express = require('express')
const router = express.Router()
const {
  generateQuiz,
  chatWithTutor,
  generateLearningPath,
  explainConcept,
  generateLearningPathChat,
  learningPathFollowup,
  saveLearningPath
} = require('../controllers/aiController')
const { protect } = require('../middleware/authMiddleware')

router.post('/generate-quiz', protect, generateQuiz)
router.post('/chat', protect, chatWithTutor)
router.post('/learning-path', protect, generateLearningPath)
router.post('/explain', protect, explainConcept)
router.post('/learning-path-chat', protect, generateLearningPathChat)
router.post('/learning-path-followup', protect, learningPathFollowup)
router.post('/save-learning-path', protect, saveLearningPath)

module.exports = router