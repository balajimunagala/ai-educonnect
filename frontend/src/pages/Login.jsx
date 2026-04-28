import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import API from '../api/axios'
import toast from 'react-hot-toast'

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await API.post('/auth/login', form)
      login(data)
      toast.success(`Welcome back, ${data.name}! 🎉`)
      navigate('/dashboard')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      {/* Background blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600 opacity-10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600 opacity-10 rounded-full blur-3xl"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">AI</span>
            </div>
            <span className="text-white font-bold text-xl">
              Edu<span className="text-blue-400">Connect</span>
            </span>
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back!</h1>
          <p className="text-gray-400">Sign in to continue learning</p>
        </div>

        {/* Form Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-gray-400 text-sm mb-2">Email address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="w-full bg-gray-800 border border-gray-700 focus:border-blue-500 focus:outline-none text-white rounded-xl px-4 py-3 transition"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-400 text-sm mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full bg-gray-800 border border-gray-700 focus:border-blue-500 focus:outline-none text-white rounded-xl px-4 py-3 transition"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition transform hover:scale-105"
            >
              {loading ? '⏳ Signing in...' : 'Sign In 🚀'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gray-800"></div>
            <span className="text-gray-600 text-sm">or</span>
            <div className="flex-1 h-px bg-gray-800"></div>
          </div>

          <p className="text-center text-gray-400 text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-400 hover:text-blue-300 font-semibold">
              Sign up for free
            </Link>
          </p>
        </div>

        <p className="text-center text-gray-600 text-xs mt-6">
          Protected by JWT Authentication 🔒
        </p>
      </div>
    </div>
  )
}

export default Login