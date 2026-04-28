import { useState } from 'react'
import API from '../api/axios'
import toast from 'react-hot-toast'

const AiTutor = () => {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! 👋 I\'m your AI tutor powered by Gemini. Ask me anything!' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const sendMessage = async () => {
    if (!input.trim() || loading) return
    const userMsg = { role: 'user', content: input }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const { data } = await API.post('/ai/chat', {
        message: input,
        courseTitle: 'General Learning',
        chatHistory: messages
      })
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])
    } catch (error) {
      toast.error('AI tutor unavailable right now')
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I\'m having trouble connecting. Please try again!' }])
    } finally {
      setLoading(false)
    }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Window */}
      {open && (
        <div className="mb-4 w-80 sm:w-96 bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden" style={{height: '450px'}}>
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-sm">🤖</div>
              <div>
                <p className="text-white font-semibold text-sm">AI Tutor</p>
                <p className="text-blue-200 text-xs">Powered by Gemini</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white text-xl">✕</button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs rounded-2xl px-4 py-2 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-gray-800 text-gray-200 rounded-bl-none'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-800 rounded-2xl rounded-bl-none px-4 py-2">
                  <div className="flex gap-1">
                    {[0,1,2].map(i => (
                      <div key={i} className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: `${i*0.15}s`}}></div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-gray-800 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask your AI tutor..."
              className="flex-1 bg-gray-800 border border-gray-700 text-white text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-3 py-2 rounded-xl transition"
            >
              ➤
            </button>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setOpen(!open)}
        className="w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-full flex items-center justify-center text-2xl shadow-lg transition transform hover:scale-110"
      >
        {open ? '✕' : '🤖'}
      </button>
    </div>
  )
}

export default AiTutor