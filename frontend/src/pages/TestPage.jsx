import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

export default function TestPage() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const questions = state?.questions || []
  const topic = state?.topic || 'Quiz'

  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [answers, setAnswers] = useState([])
  const [feedback, setFeedback] = useState(null)
  const [loadingFeedback, setLoadingFeedback] = useState(false)
  const [timeLeft, setTimeLeft] = useState(questions.length * 60)

  useEffect(() => {
    if (!questions.length) navigate('/')
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timer)
          finishTest()
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, '0')
  const seconds = String(timeLeft % 60).padStart(2, '0')

  const handleSelect = async (optionLetter) => {
    if (selected) return
    setSelected(optionLetter)
    const q = questions[current]
    const isCorrect = optionLetter === q.correct

    setAnswers(prev => [...prev, {
      question: q.question,
      selected: optionLetter,
      correct: q.correct,
      isCorrect
    }])

    if (!isCorrect) {
      setLoadingFeedback(true)
      try {
        const res = await fetch('http://localhost:8000/api/ai/explain', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            question: q.question,
            user_answer: optionLetter,
            correct_answer: q.correct
          })
        })
        const data = await res.json()
        setFeedback(data.explanation)
      } catch {
        setFeedback(q.explanation)
      } finally {
        setLoadingFeedback(false)
      }
    } else {
      setFeedback(q.explanation)
    }
  }

  const handleNext = () => {
    if (current + 1 >= questions.length) {
      finishTest()
    } else {
      setCurrent(c => c + 1)
      setSelected(null)
      setFeedback(null)
    }
  }

  const finishTest = () => {
    navigate('/results', { state: { answers, topic } })
  }

  const q = questions[current]
  const progress = ((current) / questions.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex flex-col items-center justify-center p-4">

      {/* Top Bar */}
      <div className="w-full max-w-2xl flex items-center justify-between mb-6">
        <span className="text-slate-400 text-sm font-medium">
          {topic}
        </span>
        <div className={`font-mono text-xl font-bold px-4 py-1.5 rounded-xl ${
          timeLeft < 30 ? 'bg-red-500/20 text-red-400' : 'bg-white/10 text-white'
        }`}>
          {minutes}:{seconds}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-2xl bg-white/10 rounded-full h-1.5 mb-6">
        <motion.div
          className="bg-gradient-to-r from-brand-500 to-ai-500 h-1.5 rounded-full"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -60 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-3xl p-8 w-full max-w-2xl shadow-2xl"
        >
          <p className="text-sm text-brand-500 font-semibold mb-3">
            Question {current + 1} of {questions.length}
          </p>
          <h2 className="text-xl font-bold text-gray-900 mb-6 leading-relaxed">
            {q?.question}
          </h2>

          {/* Options */}
          <div className="grid gap-3 mb-4">
            {q?.options.map((opt, i) => {
              const letter = opt[0]
              const isSelected = selected === letter
              const isCorrect = letter === q.correct
              let style = 'border-gray-200 hover:border-brand-400 hover:bg-blue-50 cursor-pointer'
              if (selected) {
                if (isCorrect) style = 'border-green-500 bg-green-50 text-green-800'
                else if (isSelected) style = 'border-red-400 bg-red-50 text-red-800'
                else style = 'border-gray-100 text-gray-400 cursor-not-allowed'
              }
              return (
                <motion.button
                  key={i}
                  whileHover={!selected ? { scale: 1.01 } : {}}
                  whileTap={!selected ? { scale: 0.99 } : {}}
                  onClick={() => handleSelect(letter)}
                  disabled={!!selected}
                  className={`p-4 rounded-xl text-left transition-all border-2 font-medium text-gray-800 ${style}`}
                >
                  {opt}
                </motion.button>
              )
            })}
          </div>

          {/* AI Feedback */}
          <AnimatePresence>
            {(feedback || loadingFeedback) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className={`p-4 rounded-xl mb-4 border ${
                  selected === q.correct
                    ? 'bg-green-50 border-green-200'
                    : 'bg-purple-50 border-purple-200'
                }`}
              >
                <p className="text-sm font-semibold text-purple-700 mb-1">
                  ✦ AI Explanation
                </p>
                {loadingFeedback ? (
                  <p className="text-sm text-purple-600 animate-pulse">Thinking...</p>
                ) : (
                  <p className="text-sm text-gray-700">{feedback}</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Next Button */}
          {selected && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={handleNext}
              className="w-full bg-gradient-to-r from-brand-500 to-ai-500 text-white py-3.5 rounded-xl font-bold hover:opacity-90 transition-all"
            >
              {current + 1 >= questions.length ? '🎉 See Results' : 'Next Question →'}
            </motion.button>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}