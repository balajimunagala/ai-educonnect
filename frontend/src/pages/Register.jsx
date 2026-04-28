import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import API from '../api/axios'
import toast from 'react-hot-toast'

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' })
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    setLoading(true)
    try {
      const { data } = await API.post('/auth/register', form)
      login(data)
      toast.success(`Welcome to AI-EduConnect, ${data.name}! 🎉`)
      navigate('/dashboard')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 py-12">
      {/* Background blobs */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600 opacity-10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-600 opacity-10 rounded-full blur-3xl"></div>

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
          <h1 className="text-3xl font-bold text-white mb-2">Create your account</h1>
          <p className="text-gray-400">Start your AI-powered learning journey</p>
        </div>

        {/* Form Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">

          {/* Role Selector */}
          <div className="flex gap-3 mb-6">
            <button
              type="button"
              onClick={() => setForm({ ...form, role: 'student' })}
              className={`flex-1 py-3 rounded-xl text-sm font-semibold transition border ${
                form.role === 'student'
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500'
              }`}
            >
              🎓 Student
            </button>
            <button
              type="button"
              onClick={() => setForm({ ...form, role: 'teacher' })}
              className={`flex-1 py-3 rounded-xl text-sm font-semibold transition border ${
                form.role === 'teacher'
                  ? 'bg-purple-600 border-purple-600 text-white'
                  : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500'
              }`}
            >
              👨‍🏫 Teacher
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-gray-400 text-sm mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
                className="w-full bg-gray-800 border border-gray-700 focus:border-blue-500 focus:outline-none text-white rounded-xl px-4 py-3 transition"
              />
            </div>

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
                placeholder="Min. 6 characters"
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
              {loading ? '⏳ Creating account...' : 'Create Account 🎓'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gray-800"></div>
            <span className="text-gray-600 text-sm">or</span>
            <div className="flex-1 h-px bg-gray-800"></div>
          </div>

          <p className="text-center text-gray-400 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-400 hover:text-blue-300 font-semibold">
              Sign in
            </Link>
          </p>
        </div>

        <p className="text-center text-gray-600 text-xs mt-6">
          By signing up you agree to our Terms of Service 📄
        </p>
      </div>
    </div>
  )
}

export default Register