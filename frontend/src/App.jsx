import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import CoursePage from './pages/CoursePage'
import QuizPage from './pages/QuizPage'

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />
          <Route path="/course/:id" element={
            <ProtectedRoute><CoursePage /></ProtectedRoute>
          } />
          <Route path="/quiz/:id" element={
            <ProtectedRoute><QuizPage /></ProtectedRoute>
          } />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App