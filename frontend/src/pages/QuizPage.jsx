import { useState } from 'react'
import Navbar from '../components/Navbar'
import API from '../api/axios'
import toast from 'react-hot-toast'
import AiTutor from '../components/AiTutor'

const QuizPage = () => {
  const [step, setStep] = useState('setup') // setup | loading | quiz | result
  const [form, setForm] = useState({ topic: '', difficulty: 'easy', count: 5 })
  const [questions, setQuestions] = useState([])
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [answers, setAnswers] = useState([])
  const [score, setScore] = useState(0)

  const generateQuiz = async () => {
    if (!form.topic.trim()) {
      toast.error('Please enter a topic!')
      return
    }
    setStep('loading')
    try {
      const { data } = await API.post('/ai/generate-quiz', form)
      setQuestions(data.questions)
      setCurrent(0)
      setAnswers([])
      setScore(0)
      setSelected(null)
      setStep('quiz')
      toast.success('Quiz generated! 🎯')
    } catch (error) {
      toast.error('Failed to generate quiz. Check your API key!')
      setStep('setup')
    }
  }

  const handleAnswer = (option) => {
    if (selected) return // already answered
    setSelected(option)
    const isCorrect = option === questions[current].answer
    if (isCorrect) setScore(s => s + 1)
    setAnswers([...answers, { question: questions[current].question, selected: option, correct: questions[current].answer, isCorrect }])
  }

  const handleNext = () => {
    if (current + 1 < questions.length) {
      setCurrent(current + 1)
      setSelected(null)
    } else {
      setStep('result')
    }
  }

  const percentage = Math.round((score / questions.length) * 100)

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-10">

        {/* SETUP SCREEN */}
        {step === 'setup' && (
          <div>
            <div className="text-center mb-10">
              <div className="text-6xl mb-4">🧠</div>
              <h1 className="text-4xl font-bold mb-2">AI Quiz Generator</h1>
              <p className="text-gray-400">Powered by Google Gemini AI — generate a quiz on any topic instantly</p>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 space-y-6">
              {/* Topic */}
              <div>
                <label className="block text-gray-400 text-sm mb-2">What topic do you want to be quizzed on?</label>
                <input
                  type="text"
                  value={form.topic}
                  onChange={(e) => setForm({ ...form, topic: e.target.value })}
                  placeholder="e.g. JavaScript, Python, React, Machine Learning..."
                  className="w-full bg-gray-800 border border-gray-700 focus:border-blue-500 focus:outline-none text-white rounded-xl px-4 py-3 transition"
                />
              </div>

              {/* Difficulty */}
              <div>
                <label className="block text-gray-400 text-sm mb-3">Difficulty Level</label>
                <div className="flex gap-3">
                  {['easy', 'medium', 'hard'].map((level) => (
                    <button
                      key={level}
                      onClick={() => setForm({ ...form, difficulty: level })}
                      className={`flex-1 py-3 rounded-xl text-sm font-semibold capitalize transition border ${
                        form.difficulty === level
                          ? level === 'easy' ? 'bg-green-600 border-green-600 text-white'
                          : level === 'medium' ? 'bg-amber-600 border-amber-600 text-white'
                          : 'bg-red-600 border-red-600 text-white'
                          : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500'
                      }`}
                    >
                      {level === 'easy' ? '😊 Easy' : level === 'medium' ? '🤔 Medium' : '🔥 Hard'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Number of questions */}
              <div>
                <label className="block text-gray-400 text-sm mb-3">
                  Number of Questions: <span className="text-white font-semibold">{form.count}</span>
                </label>
                <input
                  type="range"
                  min="3"
                  max="10"
                  value={form.count}
                  onChange={(e) => setForm({ ...form, count: parseInt(e.target.value) })}
                  className="w-full accent-blue-500"
                />
                <div className="flex justify-between text-gray-600 text-xs mt-1">
                  <span>3</span><span>10</span>
                </div>
              </div>

              <button
                onClick={generateQuiz}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 rounded-xl transition transform hover:scale-105 text-lg"
              >
                Generate Quiz with AI 🤖
              </button>
            </div>
          </div>
        )}

        {/* LOADING SCREEN */}
        {step === 'loading' && (
          <div className="text-center py-32">
            <div className="text-6xl mb-6 animate-bounce">🤖</div>
            <h2 className="text-2xl font-bold mb-2">Gemini AI is generating your quiz...</h2>
            <p className="text-gray-400">Creating {form.count} questions about "{form.topic}"</p>
            <div className="mt-8 flex justify-center gap-2">
              {[0,1,2].map(i => (
                <div key={i} className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: `${i * 0.15}s`}}></div>
              ))}
            </div>
          </div>
        )}

        {/* QUIZ SCREEN */}
        {step === 'quiz' && questions.length > 0 && (
          <div>
            {/* Progress bar */}
            <div className="flex items-center gap-4 mb-8">
              <div className="flex-1 bg-gray-800 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all"
                  style={{ width: `${((current + 1) / questions.length) * 100}%` }}
                ></div>
              </div>
              <span className="text-gray-400 text-sm whitespace-nowrap">
                {current + 1} / {questions.length}
              </span>
            </div>

            {/* Question Card */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 mb-6">
              <div className="flex items-center gap-3 mb-6">
                <span className="bg-blue-600/20 text-blue-400 text-sm px-3 py-1 rounded-full border border-blue-500/20">
                  Q{current + 1}
                </span>
                <span className={`text-sm px-3 py-1 rounded-full border ${
                  form.difficulty === 'easy' ? 'bg-green-600/20 text-green-400 border-green-500/20'
                  : form.difficulty === 'medium' ? 'bg-amber-600/20 text-amber-400 border-amber-500/20'
                  : 'bg-red-600/20 text-red-400 border-red-500/20'
                }`}>
                  {form.difficulty}
                </span>
              </div>
              <h2 className="text-xl font-semibold leading-relaxed">
                {questions[current].question}
              </h2>
            </div>

            {/* Options */}
            <div className="space-y-3 mb-6">
              {questions[current].options.map((option, i) => {
                let style = 'bg-gray-900 border-gray-700 text-white hover:border-blue-500'
                if (selected) {
                  if (option === questions[current].answer) style = 'bg-green-600/20 border-green-500 text-green-400'
                  else if (option === selected && option !== questions[current].answer) style = 'bg-red-600/20 border-red-500 text-red-400'
                  else style = 'bg-gray-900 border-gray-800 text-gray-500'
                }
                return (
                  <button
                    key={i}
                    onClick={() => handleAnswer(option)}
                    className={`w-full text-left border rounded-xl px-6 py-4 transition font-medium ${style}`}
                  >
                    <span className="text-gray-500 mr-3">{['A', 'B', 'C', 'D'][i]}.</span>
                    {option}
                  </button>
                )
              })}
            </div>

            {/* Explanation + Next */}
            {selected && (
              <div>
                <div className={`rounded-xl p-4 mb-4 border ${
                  selected === questions[current].answer
                    ? 'bg-green-600/10 border-green-500/30 text-green-400'
                    : 'bg-red-600/10 border-red-500/30 text-red-400'
                }`}>
                  <p className="font-semibold mb-1">
                    {selected === questions[current].answer ? '✅ Correct!' : '❌ Incorrect!'}
                  </p>
                  <p className="text-sm text-gray-300">{questions[current].explanation}</p>
                </div>
                <button
                  onClick={handleNext}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl transition"
                >
                  {current + 1 < questions.length ? 'Next Question →' : 'See Results 🎯'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* RESULT SCREEN */}
        {step === 'result' && (
          <div className="text-center">
            <div className="text-7xl mb-6">
              {percentage >= 80 ? '🏆' : percentage >= 60 ? '👍' : '📚'}
            </div>
            <h1 className="text-4xl font-bold mb-2">Quiz Complete!</h1>
            <p className="text-gray-400 mb-8">Here's how you did on "{form.topic}"</p>

            {/* Score circle */}
            <div className="inline-flex items-center justify-center w-40 h-40 rounded-full border-8 border-blue-500/30 bg-blue-600/10 mb-8">
              <div>
                <div className="text-4xl font-bold text-blue-400">{percentage}%</div>
                <div className="text-gray-400 text-sm">{score}/{questions.length}</div>
              </div>
            </div>

            <p className="text-lg text-gray-300 mb-8">
              {percentage >= 80 ? '🔥 Excellent! You really know this topic!'
              : percentage >= 60 ? '👍 Good job! Keep practicing!'
              : '📚 Keep studying! You\'ll get better with practice!'}
            </p>

            {/* Answer Review */}
            <div className="text-left space-y-3 mb-8">
              <h3 className="font-semibold text-gray-300 mb-4">Answer Review:</h3>
              {answers.map((a, i) => (
                <div key={i} className={`rounded-xl p-4 border ${a.isCorrect ? 'bg-green-600/10 border-green-500/20' : 'bg-red-600/10 border-red-500/20'}`}>
                  <p className="text-sm text-gray-300 mb-1">{a.question}</p>
                  <p className={`text-sm font-semibold ${a.isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                    {a.isCorrect ? '✅' : '❌'} Your answer: {a.selected}
                  </p>
                  {!a.isCorrect && <p className="text-sm text-gray-400">Correct: {a.correct}</p>}
                </div>
              ))}
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => { setStep('setup'); setForm({ topic: '', difficulty: 'easy', count: 5 }) }}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl transition"
              >
                Try Another Quiz 🔄
              </button>
            </div>
          </div>
        )}
      </div>
      <AiTutor />
    </div>
  )
}

export default QuizPage