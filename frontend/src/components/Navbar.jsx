import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully!')
    navigate('/')
  }

  return (
    <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">AI</span>
            </div>
            <span className="text-white font-bold text-lg">
              Edu<span className="text-blue-400">Connect</span>
            </span>
          </Link>

          {/* Nav links */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="text-gray-400 text-sm hidden sm:block">
                  👋 Hey, {user.name}
                </span>
                <Link
                  to="/dashboard"
                  className="text-gray-300 hover:text-white text-sm transition"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded-lg transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-300 hover:text-white text-sm transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg transition"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar