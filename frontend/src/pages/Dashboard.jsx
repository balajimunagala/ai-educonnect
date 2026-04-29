import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import AiTutor from '../components/AiTutor'
import { Link } from 'react-router-dom'



const stats = [
  { label: 'Courses Enrolled', value: '0', icon: '📚' },
  { label: 'Quizzes Taken', value: '0', icon: '🧠' },
  { label: 'Avg. Score', value: '0%', icon: '🎯' },
  { label: 'Hours Learned', value: '0', icon: '⏱️' },
]

const Dashboard = () => {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/20 rounded-2xl p-8 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-2xl font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold">Welcome back, {user?.name}! 👋</h1>
              <p className="text-gray-400 mt-1">
                {user?.role === 'teacher' ? '👨‍🏫 Teacher Account' : '🎓 Student Account'} •
                Ready to {user?.role === 'teacher' ? 'teach' : 'learn'} something amazing today?
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <div className="text-3xl mb-3">{stat.icon}</div>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-gray-400 text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link to="/quiz/general" className="bg-blue-600/10 border border-blue-500/20 hover:border-blue-500/50 rounded-xl p-4 cursor-pointer transition group">
                <div className="text-2xl mb-2">🤖</div>
                <h3 className="font-semibold group-hover:text-blue-400 transition">AI Quiz Generator</h3>
                <p className="text-gray-400 text-sm mt-1">Generate a quiz on any topic instantly</p>
              </Link>
              {/* AI Tutor Chat — opens the bubble */}
                <button
                onClick={() => {
                    const btn = document.getElementById('ai-tutor-toggle')
                    if (btn) btn.click()
                }}
                className="bg-purple-600/10 border border-purple-500/20 hover:border-purple-500/60 rounded-xl p-4 transition group text-left w-full"
                >
                    <div className="text-2xl mb-2">💬</div>
                    <h3 className="font-semibold group-hover:text-purple-400 transition">AI Tutor Chat</h3>
                    <p className="text-gray-400 text-sm mt-1">Ask your AI tutor anything</p>
                </button>

            {/* Learning Path */}
                <Link
                to="/learning-path"
                  className="bg-green-600/10 border border-green-500/20 hover:border-green-500/60 rounded-xl p-4 transition group block"
                  >
                  <div className="text-2xl mb-2">🗺️</div>
                  <h3 className="font-semibold group-hover:text-green-400 transition">Learning Path</h3>
                  <p className="text-gray-400 text-sm mt-1">AI builds your personalized roadmap</p>
                </Link>

                {/* Browse Courses */}
                <Link
                to="/courses"
                className="bg-amber-600/10 border border-amber-500/20 hover:border-amber-500/60 rounded-xl p-4 transition group block"
                >
                <div className="text-2xl mb-2">📚</div>
                <h3 className="font-semibold group-hover:text-amber-400 transition">Browse Courses</h3>
                <p className="text-gray-400 text-sm mt-1">Explore all available courses</p>
                </Link>
            </div>
          </div>

          {/* AI Tip of the Day */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-4">🤖 AI Tip of the Day</h2>
            <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/20 rounded-xl p-4 mb-4">
              <p className="text-gray-300 text-sm leading-relaxed">
                "The best way to learn programming is to build real projects.
                Start small, stay consistent, and let AI help you when you're stuck!"
              </p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <span className="text-green-400">✓</span>
                <span>Complete 1 lesson daily</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <span className="text-green-400">✓</span>
                <span>Take AI quiz after each topic</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <span className="text-green-400">✓</span>
                <span>Review weak areas with AI tutor</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AiTutor />
    </div>
  )
}

export default Dashboard