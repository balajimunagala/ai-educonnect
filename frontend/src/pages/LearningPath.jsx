import Navbar from '../components/Navbar'
import AiTutor from '../components/AiTutor'

const LearningPath = () => {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">🗺️</div>
        <h1 className="text-3xl font-bold mb-2">Learning Path</h1>
        <p className="text-gray-400">Coming soon — AI will generate your personalized study plan!</p>
      </div>
      <AiTutor />
    </div>
  )
}

export default LearningPath