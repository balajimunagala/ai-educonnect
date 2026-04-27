const Course = require('../models/Course');
const User = require('../models/User');

// @GET /api/courses - get all published courses
const getCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true })
      .populate('teacher', 'name email');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @GET /api/courses/:id - get single course
const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('teacher', 'name email');
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @POST /api/courses - create course (teacher only)
const createCourse = async (req, res) => {
  try {
    const { title, description, category, difficulty, modules } = req.body;
    const course = await Course.create({
      title, description, category,
      difficulty, modules,
      teacher: req.user._id
    });
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @POST /api/courses/:id/enroll - enroll student
const enrollCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    // Check if already enrolled
    if (course.enrolledStudents.includes(req.user._id)) {
      return res.status(400).json({ message: 'Already enrolled' });
    }

    course.enrolledStudents.push(req.user._id);
    await course.save();

    // Also add to user's enrolledCourses
    await User.findByIdAndUpdate(req.user._id, {
      $push: { enrolledCourses: course._id }
    });

    res.json({ message: 'Enrolled successfully!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getCourses, getCourseById, createCourse, enrollCourse };