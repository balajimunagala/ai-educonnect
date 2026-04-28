import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'

const features = [
  {
    icon: '🤖',
    title: 'AI-Powered Quizzes',
    desc: 'Gemini AI generates personalized quizzes based on your learning level and progress.'
  },
  {
    icon: '💬',
    title: 'AI Tutor Chatbot',
    desc: 'Ask anything, anytime. Your personal AI tutor is available 24/7 to help you learn.'
  },
  {
    icon: '📈',
    title: 'Smart Progress Tracking',
    desc: 'Visual dashboards show your growth, strengths, and areas that need improvement.'
  },
  {
    icon: '🎯',
    title: 'Personalized Learning Paths',
    desc: 'AI recommends the perfect learning journey based on your goals and pace.'
  },
  {
    icon: '🌍',
    title: 'Access for Everyone',
    desc: 'Breaking barriers to quality education for students everywhere in the world.'
  },
  {
    icon: '⚡',
    title: 'Learn Faster',
    desc: 'Adaptive difficulty ensures you are always challenged at the right level.'
  }
]

const stats = [
  { value: '10K+', label: 'Students' },
  { value: '500+', label: 'Courses' },
  { value: '98%', label: 'Satisfaction' },
  { value: '24/7', label: 'AI Support' }
]

const Landing = () => {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background gradient blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600 opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-purple-600 opacity-10 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 py-24 text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 px-4 py-2 rounded-full text-sm mb-8">
            <span>🏆</span>
            <span>Google Solution Challenge 2026</span>
          </div>

          {/* Heading */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Learn Smarter with
            <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              AI-Powered Education
            </span>
          </h1>

          <p className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto mb-10">
            AI-EduConnect uses Google Gemini AI to deliver personalized learning experiences,
            adaptive quizzes, and intelligent tutoring for every student.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-4 rounded-xl text-lg transition transform hover:scale-105"
            >
              Start Learning Free 🚀
            </Link>
            <Link
              to="/login"
              className="border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white font-semibold px-8 py-4 rounded-xl text-lg transition"
            >
              Sign In
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-20 max-w-3xl mx-auto">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-gray-500 text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Everything you need to
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> succeed</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Powered by Google Gemini AI, built for the future of education
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-gray-900 border border-gray-800 hover:border-blue-500/50 rounded-2xl p-6 transition group"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-blue-400 transition">
                {feature.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 py-24">
        <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/20 rounded-3xl p-12 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to transform your learning?</h2>
          <p className="text-gray-400 text-lg mb-8">
            Join thousands of students already learning smarter with AI
          </p>
          <Link
            to="/register"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-10 py-4 rounded-xl text-lg transition transform hover:scale-105 inline-block"
          >
            Get Started for Free 🎓
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 text-center text-gray-500 text-sm">
        <p>Built with ❤️ for Google Solution Challenge 2026 • AI-EduConnect</p>
        <p className="mt-1">Powered by Google Gemini AI • SDG 4: Quality Education</p>
      </footer>
    </div>
  )
}

export default Landing