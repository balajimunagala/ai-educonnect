import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import AiTutor from '../components/AiTutor'

// Dummy courses data (will connect to backend later)
const dummyCourses = [
  {
    _id: '1',
    title: 'JavaScript Fundamentals',
    description: 'Master the basics of JavaScript from scratch. Learn variables, functions, arrays, objects and more.',
    category: 'Programming',
    difficulty: 'beginner',
    teacher: { name: 'John Smith' },
    thumbnail: '🟨',
    modules: [
      { _id: 'm1', title: 'Introduction to JavaScript', content: 'JavaScript is a programming language that runs in the browser. It makes websites interactive and dynamic. Every modern website uses JavaScript.' },
      { _id: 'm2', title: 'Variables and Data Types', content: 'Variables store data. In JavaScript we use let, const and var. Data types include strings, numbers, booleans, arrays and objects.' },
      { _id: 'm3', title: 'Functions', content: 'Functions are reusable blocks of code. You define them once and call them many times. They can take inputs (parameters) and return outputs.' },
    ]
  },
  {
    _id: '2',
    title: 'React for Beginners',
    description: 'Learn React from zero. Components, hooks, state management and building real projects.',
    category: 'Frontend',
    difficulty: 'intermediate',
    teacher: { name: 'Sarah Johnson' },
    thumbnail: '⚛️',
    modules: [
      { _id: 'm1', title: 'What is React?', content: 'React is a JavaScript library for building user interfaces. It uses components — small reusable pieces of UI that fit together like LEGO blocks.' },
      { _id: 'm2', title: 'Components and Props', content: 'Components are the building blocks of React. Props are how you pass data between components — like function parameters.' },
      { _id: 'm3', title: 'State and Hooks', content: 'State is data that changes over time. Hooks like useState and useEffect let you add state and side effects to functional components.' },
    ]
  },
  {
    _id: '3',
    title: 'Python Basics',
    description: 'Start your programming journey with Python. Simple syntax, powerful results.',
    category: 'Programming',
    difficulty: 'beginner',
    teacher: { name: 'Mike Chen' },
    thumbnail: '🐍',
    modules: [
      { _id: 'm1', title: 'Getting Started with Python', content: 'Python is one of the most popular programming languages. It is easy to read, write and learn. Used in web development, AI, data science and more.' },
      { _id: 'm2', title: 'Variables and Loops', content: 'Variables store your data. Loops repeat code. The for loop and while loop are the two main loops in Python.' },
      { _id: 'm3', title: 'Functions and Modules', content: 'Functions let you reuse code. Modules are files containing functions you can import. Python has thousands of free modules.' },
    ]
  },
  {
    _id: '4',
    title: 'Machine Learning Intro',
    description: 'Understand the fundamentals of Machine Learning and AI with practical examples.',
    category: 'AI/ML',
    difficulty: 'advanced',
    teacher: { name: 'Dr. Priya Sharma' },
    thumbnail: '🤖',
    modules: [
      { _id: 'm1', title: 'What is Machine Learning?', content: 'Machine Learning is teaching computers to learn from data without being explicitly programmed. It powers recommendations, image recognition and more.' },
      { _id: 'm2', title: 'Types of ML', content: 'There are 3 main types: Supervised Learning (labeled data), Unsupervised Learning (finds patterns), and Reinforcement Learning (learns by reward).' },
      { _id: 'm3', title: 'Your First ML Model', content: 'We use libraries like scikit-learn to build models. The basic steps are: collect data, prepare data, train model, evaluate, and predict.' },
    ]
  },
  {
    _id: '5',
    title: 'Web Design with CSS',
    description: 'Create beautiful, responsive websites using modern CSS techniques.',
    category: 'Design',
    difficulty: 'beginner',
    teacher: { name: 'Emma Wilson' },
    thumbnail: '🎨',
    modules: [
      { _id: 'm1', title: 'CSS Basics', content: 'CSS styles your HTML. You can change colors, fonts, sizes and layouts. Every website uses CSS to look good.' },
      { _id: 'm2', title: 'Flexbox Layout', content: 'Flexbox makes it easy to align and distribute elements. Use display:flex on a container to start using flexbox.' },
      { _id: 'm3', title: 'Responsive Design', content: 'Responsive design makes websites work on all screen sizes. Use media queries to apply different styles for mobile, tablet and desktop.' },
    ]
  },
  {
    _id: '6',
    title: 'Node.js Backend Development',
    description: 'Build powerful backend APIs with Node.js and Express.',
    category: 'Backend',
    difficulty: 'intermediate',
    teacher: { name: 'Alex Kumar' },
    thumbnail: '🟩',
    modules: [
      { _id: 'm1', title: 'Introduction to Node.js', content: 'Node.js lets you run JavaScript on the server. It is fast, lightweight and perfect for building APIs and real-time applications.' },
      { _id: 'm2', title: 'Express Framework', content: 'Express is a minimal web framework for Node.js. It makes it easy to create routes, handle requests and send responses.' },
      { _id: 'm3', title: 'REST APIs', content: 'REST APIs use HTTP methods like GET, POST, PUT and DELETE. They allow frontend and backend to communicate using JSON data.' },
    ]
  },
]

const difficultyColor = {
  beginner: 'text-green-400 bg-green-400/10 border-green-400/20',
  intermediate: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  advanced: 'text-red-400 bg-red-400/10 border-red-400/20',
}

// ─── COURSE LISTING PAGE ───────────────────────────────────────
const CourseList = () => {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')

  const categories = ['All', 'Programming', 'Frontend', 'Backend', 'AI/ML', 'Design']

  const filtered = dummyCourses.filter(course => {
    const matchSearch = course.title.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'All' || course.category === filter
    return matchSearch && matchFilter
  })

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-3">Browse Courses 📚</h1>
          <p className="text-gray-400">Explore our AI-powered courses and start learning today</p>
        </div>

        {/* Search */}
        <div className="max-w-xl mx-auto mb-6">
          <input
            type="text"
            placeholder="🔍 Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 focus:border-blue-500 focus:outline-none text-white rounded-xl px-5 py-3 transition"
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition border ${
                filter === cat
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'bg-gray-900 border-gray-700 text-gray-400 hover:border-gray-500'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(course => (
            <Link
              key={course._id}
              to={`/course/${course._id}`}
              className="bg-gray-900 border border-gray-800 hover:border-blue-500/50 rounded-2xl p-6 transition group block"
            >
              {/* Thumbnail */}
              <div className="text-5xl mb-4">{course.thumbnail}</div>

              {/* Badges */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs text-blue-400 bg-blue-400/10 border border-blue-400/20 px-2 py-1 rounded-full">
                  {course.category}
                </span>
                <span className={`text-xs px-2 py-1 rounded-full border capitalize ${difficultyColor[course.difficulty]}`}>
                  {course.difficulty}
                </span>
              </div>

              <h3 className="text-lg font-semibold mb-2 group-hover:text-blue-400 transition">
                {course.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                {course.description}
              </p>

              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>👨‍🏫 {course.teacher.name}</span>
                <span>📖 {course.modules.length} modules</span>
              </div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            <div className="text-5xl mb-4">😕</div>
            <p>No courses found for "{search}"</p>
          </div>
        )}
      </div>
      <AiTutor />
    </div>
  )
}

// ─── SINGLE COURSE VIEWER ──────────────────────────────────────
const CourseViewer = ({ courseId }) => {
  const course = dummyCourses.find(c => c._id === courseId)
  const [activeModule, setActiveModule] = useState(0)
  const [completed, setCompleted] = useState([])

  if (!course) return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">😕</div>
        <h2 className="text-2xl font-bold mb-2">Course not found</h2>
        <Link to="/courses" className="text-blue-400 hover:underline">← Back to courses</Link>
      </div>
    </div>
  )

  const toggleComplete = (moduleId) => {
    setCompleted(prev =>
      prev.includes(moduleId)
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    )
  }

  const progress = Math.round((completed.length / course.modules.length) * 100)

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Back button */}
        <Link to="/courses" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition">
          ← Back to Courses
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left — Module List */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              {/* Course Info */}
              <div className="text-4xl mb-3">{course.thumbnail}</div>
              <h2 className="font-bold text-lg mb-1">{course.title}</h2>
              <p className="text-gray-400 text-sm mb-4">👨‍🏫 {course.teacher.name}</p>

              {/* Progress bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-400 mb-2">
                  <span>Progress</span>
                  <span className="text-blue-400 font-semibold">{progress}%</span>
                </div>
                <div className="bg-gray-800 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Module List */}
              <div className="space-y-2">
                {course.modules.map((mod, i) => (
                  <button
                    key={mod._id}
                    onClick={() => setActiveModule(i)}
                    className={`w-full text-left px-4 py-3 rounded-xl transition flex items-center gap-3 ${
                      activeModule === i
                        ? 'bg-blue-600/20 border border-blue-500/40 text-blue-400'
                        : 'hover:bg-gray-800 text-gray-300 border border-transparent'
                    }`}
                  >
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${
                      completed.includes(mod._id)
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-700 text-gray-400'
                    }`}>
                      {completed.includes(mod._id) ? '✓' : i + 1}
                    </span>
                    <span className="text-sm font-medium">{mod.title}</span>
                  </button>
                ))}
              </div>

              {/* Quiz Button */}
              <Link
                to={`/quiz/${course._id}`}
                className="mt-4 w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm font-semibold py-3 rounded-xl transition text-center block"
              >
                🧠 Take AI Quiz
              </Link>
            </div>
          </div>

          {/* Right — Module Content */}
          <div className="lg:col-span-2">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Module {activeModule + 1} of {course.modules.length}</p>
                  <h2 className="text-2xl font-bold">{course.modules[activeModule].title}</h2>
                </div>
                <button
                  onClick={() => toggleComplete(course.modules[activeModule]._id)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition border ${
                    completed.includes(course.modules[activeModule]._id)
                      ? 'bg-green-600/20 border-green-500/40 text-green-400'
                      : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-green-500'
                  }`}
                >
                  {completed.includes(course.modules[activeModule]._id) ? '✅ Completed' : 'Mark Complete'}
                </button>
              </div>

              {/* Content */}
              <div className="bg-gray-800/50 rounded-xl p-6 mb-6">
                <p className="text-gray-200 leading-relaxed text-lg">
                  {course.modules[activeModule].content}
                </p>
              </div>

              {/* Navigation */}
              <div className="flex justify-between gap-4">
                <button
                  onClick={() => setActiveModule(Math.max(0, activeModule - 1))}
                  disabled={activeModule === 0}
                  className="px-6 py-3 bg-gray-800 hover:bg-gray-700 disabled:opacity-30 rounded-xl text-sm font-semibold transition"
                >
                  ← Previous
                </button>
                <button
                  onClick={() => {
                    toggleComplete(course.modules[activeModule]._id)
                    setActiveModule(Math.min(course.modules.length - 1, activeModule + 1))
                  }}
                  disabled={activeModule === course.modules.length - 1}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-30 rounded-xl text-sm font-semibold transition"
                >
                  Next →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AiTutor />
    </div>
  )
}

// ─── MAIN EXPORT — decides which view to show ──────────────────
const CoursePage = () => {
  const { id } = useParams()

  // If id is undefined = /courses listing page
  // If id exists = /course/:id viewer
  if (!id) return <CourseList />
  return <CourseViewer courseId={id} />
}

export default CoursePage