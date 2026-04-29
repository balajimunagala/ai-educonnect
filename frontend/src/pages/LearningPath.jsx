import { useState, useRef, useEffect } from 'react'
import Navbar from '../components/Navbar'
import AiTutor from '../components/AiTutor'
import API from '../api/axios'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const getYouTubeThumbnail = (url) => {
  try {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url?.match(regExp)
    if (match && match[2].length === 11) {
      return `https://img.youtube.com/vi/${match[2]}/mqdefault.jpg`
    }
  } catch (e) {}
  return null
}

const getPlatformColor = (platform) => {
  const p = platform?.toLowerCase()
  if (p?.includes('youtube')) return { bg: 'bg-red-600', text: 'YouTube' }
  if (p?.includes('udemy')) return { bg: 'bg-purple-600', text: 'Udemy' }
  if (p?.includes('coursera')) return { bg: 'bg-blue-600', text: 'Coursera' }
  if (p?.includes('odin')) return { bg: 'bg-amber-600', text: 'The Odin Project' }
  if (p?.includes('freecodecamp')) return { bg: 'bg-green-600', text: 'freeCodeCamp' }
  return { bg: 'bg-gray-600', text: platform || 'Resource' }
}

const ResourceCard = ({ resource }) => {
  const thumbnail = getYouTubeThumbnail(resource.url)
  const platform = getPlatformColor(resource.platform)
  return (
    <a href={resource.url} target="_blank" rel="noopener noreferrer"
      className="flex gap-3 bg-gray-800 border border-gray-700 hover:border-blue-500/50 rounded-xl p-3 transition group">
      <div className="flex-shrink-0 w-28 h-16 rounded-lg overflow-hidden bg-gray-700">
        {thumbnail ? (
          <img src={thumbnail} alt={resource.title} className="w-full h-full object-cover"
            onError={(e) => { e.target.style.display = 'none' }} />
        ) : (
          <div className={`w-full h-full ${platform.bg} flex items-center justify-center`}>
            <span className="text-white text-xs font-bold text-center px-1">{platform.text}</span>
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-xs text-white px-2 py-0.5 rounded-full ${platform.bg}`}>{platform.text}</span>
          {resource.duration && (
            <span className="text-xs text-gray-500">{resource.duration}</span>
          )}
        </div>
        <p className="text-white text-sm font-semibold truncate group-hover:text-blue-400 transition">{resource.title}</p>
        <p className="text-gray-400 text-xs truncate">{resource.channel}</p>
        {resource.why && (
          <p className="text-gray-500 text-xs mt-1">{resource.why}</p>
        )}
      </div>
      <div className="flex-shrink-0 text-gray-600 group-hover:text-blue-400 transition self-center">→</div>
    </a>
  )
}

const PhaseCard = ({ phase, index }) => {
  const [open, setOpen] = useState(index === 0)
  return (
    <div className="bg-gray-900 border border-gray-800 hover:border-blue-500/30 rounded-2xl overflow-hidden transition">
      <button onClick={() => setOpen(!open)}
        className="w-full text-left p-5 flex items-center gap-4">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0">
          {phase.phase}
        </div>
        <div className="flex-1">
          <h3 className="text-white font-semibold">{phase.title}</h3>
          <p className="text-gray-400 text-sm">{phase.duration}</p>
        </div>
        <span className="text-gray-500 text-xl">{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div className="px-5 pb-5 space-y-4">
          <div className="bg-blue-600/10 border border-blue-500/20 rounded-xl p-3">
            <p className="text-blue-400 text-sm font-semibold mb-1">Goal</p>
            <p className="text-gray-300 text-sm">{phase.goal}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm font-semibold mb-2">Topics Covered</p>
            <div className="flex flex-wrap gap-2">
              {phase.topics?.map((topic, i) => (
                <span key={i} className="bg-gray-800 border border-gray-700 text-gray-300 text-xs px-3 py-1 rounded-full">
                  {topic}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-gray-400 text-sm font-semibold mb-2">Best Resources</p>
            <div className="space-y-2">
              {phase.resources?.map((resource, i) => (
                <ResourceCard key={i} resource={resource} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const LearningPath = () => {
  const [step, setStep] = useState('search')
  const [topic, setTopic] = useState('')
  const [type, setType] = useState('free')
  const [learningPath, setLearningPath] = useState(null)
  const [chatHistory, setChatHistory] = useState([])
  const [followup, setFollowup] = useState('')
  const [followupLoading, setFollowupLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const navigate = useNavigate()
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [learningPath])

  const generatePath = async () => {
    if (!topic.trim()) {
      toast.error('Please enter what you want to learn!')
      return
    }
    setStep('loading')
    setChatHistory([])
    try {
      const { data } = await API.post('/ai/learning-path-chat', {
        topic,
        type,
        chatHistory: []
      })
      setLearningPath(data.learningPath)
      setChatHistory([
        { role: 'user', content: `I want to learn ${topic} using ${type} resources` },
        { role: 'assistant', content: JSON.stringify(data.learningPath) }
      ])
      setStep('result')
      toast.success('Learning path generated!')
    } catch (error) {
      toast.error('Failed to generate path. Check your API key!')
      setStep('search')
    }
  }

  const handleFollowup = async () => {
    if (!followup.trim() || followupLoading) return
    setFollowupLoading(true)
    const msg = followup
    setFollowup('')
    const newHistory = [...chatHistory, { role: 'user', content: msg }]
    setChatHistory(newHistory)
    try {
      const { data } = await API.post('/ai/learning-path-followup', {
        message: msg,
        chatHistory: newHistory,
        currentPath: learningPath
      })
      setLearningPath(data.learningPath)
      setChatHistory([...newHistory, { role: 'assistant', content: JSON.stringify(data.learningPath) }])
      toast.success('Path updated!')
    } catch (error) {
      toast.error('Failed to update path')
    } finally {
      setFollowupLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const { data } = await API.post('/ai/save-learning-path', {
        chatHistory,
        currentPath: learningPath
      })
      toast.success('Saved to your courses!')
      setTimeout(() => navigate(`/course/${data.course._id}`), 1500)
    } catch (error) {
      toast.error('Failed to save. Try again!')
    } finally {
      setSaving(false)
    }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleFollowup()
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-10">

        {step === 'search' && (
          <div>
            <div className="text-center mb-10">
              <div className="text-6xl mb-4">🗺️</div>
              <h1 className="text-4xl font-bold mb-3">
                AI Learning Path
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> Generator</span>
              </h1>
              <p className="text-gray-400 text-lg">Type what you want to learn — AI builds your complete roadmap</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 space-y-6">
              <div>
                <label className="block text-gray-400 text-sm mb-2">What do you want to learn?</label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && generatePath()}
                  placeholder="e.g. Frontend Development, Machine Learning, UI/UX Design..."
                  className="w-full bg-gray-800 border border-gray-700 focus:border-blue-500 focus:outline-none text-white rounded-xl px-4 py-4 text-lg transition"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-3">Resource Type</label>
                <div className="flex gap-3">
                  <button onClick={() => setType('free')}
                    className={`flex-1 py-4 rounded-xl font-semibold transition border ${
                      type === 'free'
                        ? 'bg-green-600 border-green-600 text-white'
                        : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500'
                    }`}>
                    Free Resources
                    <p className="text-xs font-normal mt-1 opacity-75">YouTube, freeCodeCamp, etc.</p>
                  </button>
                  <button onClick={() => setType('paid')}
                    className={`flex-1 py-4 rounded-xl font-semibold transition border ${
                      type === 'paid'
                        ? 'bg-purple-600 border-purple-600 text-white'
                        : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500'
                    }`}>
                    Paid Courses
                    <p className="text-xs font-normal mt-1 opacity-75">Udemy, Coursera, etc.</p>
                  </button>
                </div>
              </div>
              <button onClick={generatePath}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 rounded-xl transition transform hover:scale-105 text-lg">
                Generate My Learning Path
              </button>
            </div>
            <div className="mt-6">
              <p className="text-gray-500 text-sm text-center mb-3">Try these:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {['Frontend Development', 'Python for Beginners', 'UI/UX Design', 'Machine Learning', 'Backend with Node.js', 'React Native'].map(s => (
                  <button key={s} onClick={() => setTopic(s)}
                    className="bg-gray-900 border border-gray-700 hover:border-blue-500 text-gray-400 hover:text-white text-sm px-4 py-2 rounded-full transition">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 'loading' && (
          <div className="text-center py-32">
            <div className="text-6xl mb-6 animate-bounce">🤖</div>
            <h2 className="text-2xl font-bold mb-2">Building your learning path...</h2>
            <p className="text-gray-400">Gemini AI is researching the best resources for "{topic}"</p>
            <div className="mt-8 flex justify-center gap-2">
              {[0, 1, 2].map(i => (
                <div key={i} className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}></div>
              ))}
            </div>
          </div>
        )}

        {step === 'result' && learningPath && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <button onClick={() => { setStep('search'); setLearningPath(null) }}
                className="text-gray-400 hover:text-white transition text-sm">
                ← New Search
              </button>
              <button onClick={handleSave} disabled={saving}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 text-white font-semibold px-6 py-3 rounded-xl transition flex items-center gap-2">
                {saving ? 'Saving...' : 'Save to My Courses'}
              </button>
            </div>

            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/20 rounded-2xl p-6 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <span className={`text-xs px-3 py-1 rounded-full font-semibold border ${
                  type === 'free'
                    ? 'bg-green-600/20 border-green-500/30 text-green-400'
                    : 'bg-purple-600/20 border-purple-500/30 text-purple-400'
                }`}>
                  {type === 'free' ? 'Free Resources' : 'Paid Courses'}
                </span>
                <span className="text-xs text-gray-400 bg-gray-800 border border-gray-700 px-3 py-1 rounded-full">
                  {learningPath.totalWeeks} weeks
                </span>
                <span className="text-xs text-gray-400 bg-gray-800 border border-gray-700 px-3 py-1 rounded-full capitalize">
                  {learningPath.difficulty}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">{learningPath.title}</h1>
              <p className="text-gray-300 text-sm">{learningPath.overview}</p>
              <div className="flex gap-4 mt-4 text-sm text-gray-400">
                <span>{learningPath.phases?.length} phases</span>
                <span>{learningPath.totalResources} resources</span>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              {learningPath.phases?.map((phase, i) => (
                <PhaseCard key={i} phase={phase} index={i} />
              ))}
            </div>

            {learningPath.tips?.length > 0 && (
              <div className="bg-amber-600/10 border border-amber-500/20 rounded-2xl p-5 mb-6">
                <h3 className="text-amber-400 font-semibold mb-3">Pro Tips</h3>
                <ul className="space-y-2">
                  {learningPath.tips.map((tip, i) => (
                    <li key={i} className="text-gray-300 text-sm flex gap-2">
                      <span className="text-amber-400">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 mb-6">
              <h3 className="text-gray-300 font-semibold mb-1">Refine your path</h3>
              <p className="text-gray-500 text-sm mb-4">Ask follow-up questions to customize this path</p>
              <div className="space-y-2 mb-4 max-h-40 overflow-y-auto">
                {chatHistory.filter(m => m.role === 'user').slice(1).map((msg, i) => (
                  <div key={i} className="bg-blue-600/10 border border-blue-500/20 rounded-xl px-4 py-2 text-sm text-blue-300">
                    You: {msg.content}
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                {['Make it shorter — 4 weeks', 'Add TypeScript', 'I only have 1 hour per day', 'Make it more advanced', 'Add more projects'].map(s => (
                  <button key={s} onClick={() => setFollowup(s)}
                    className="bg-gray-800 border border-gray-700 hover:border-blue-500 text-gray-400 hover:text-white text-xs px-3 py-1.5 rounded-full transition">
                    {s}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={followup}
                  onChange={(e) => setFollowup(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder="e.g. Make it shorter, add more projects, focus on React only..."
                  className="flex-1 bg-gray-800 border border-gray-700 focus:border-blue-500 focus:outline-none text-white rounded-xl px-4 py-3 text-sm transition"
                />
                <button onClick={handleFollowup} disabled={followupLoading || !followup.trim()}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-5 py-3 rounded-xl transition font-semibold">
                  {followupLoading ? '...' : 'Send'}
                </button>
              </div>
            </div>

            <button onClick={handleSave} disabled={saving}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 text-white font-semibold py-4 rounded-xl transition text-lg">
              {saving ? 'Saving to your courses...' : 'Save Path to My Courses'}
            </button>

            <div ref={bottomRef} />
          </div>
        )}
      </div>
      <AiTutor />
    </div>
  )
}

export default LearningPath