const express = require('express');
const router = express.Router();
const { getCourses, getCourseById, createCourse, enrollCourse } = require('../controllers/courseController');
const { protect, teacherOnly } = require('../middleware/authMiddleware');

router.get('/', getCourses);
router.get('/:id', getCourseById);
router.post('/', protect, teacherOnly, createCourse);
router.post('/:id/enroll', protect, enrollCourse);

module.exports = router;