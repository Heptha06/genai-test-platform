import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Results() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const answers = state?.answers || []
  const topic = state?.topic || 'Quiz'

  const score = answers.filter(a => a.isCorrect).length
  const total = answers.length
  const percent = total ? Math.round((score / total) * 100) : 0

  const grade = percent >= 80 ? { label: 'Excellent!', color: 'text-green-400', emoji: '🏆' }
              : percent >= 60 ? { label: 'Good Job!', color: 'text-blue-400', emoji: '👍' }
              : percent >= 40 ? { label: 'Keep Going!', color: 'text-yellow-400', emoji: '💪' }
              : { label: 'Keep Practicing!', color: 'text-red-400', emoji: '📚' }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4">
      <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500 rounded-full opacity-10 blur-3xl" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500 rounded-full opacity-10 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 w-full max-w-lg shadow-2xl"
      >
        {/* Score Circle */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-flex flex-col items-center justify-center w-36 h-36 rounded-full border-4 border-brand-500/50 bg-brand-500/10 mb-4"
          >
            <span className="text-4xl font-extrabold text-white">{percent}%</span>
            <span className="text-slate-400 text-xs">Score</span>
          </motion.div>
          <h2 className={`text-2xl font-extrabold mb-1 ${grade.color}`}>
            {grade.emoji} {grade.label}
          </h2>
          <p className="text-slate-400 text-sm">
            {score} out of {total} correct on <span className="text-white font-semibold">{topic}</span>
          </p>
        </div>

        {/* Answer Review */}
        <div className="space-y-3 mb-8 max-h-60 overflow-y-auto pr-1">
          {answers.map((a, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`p-3 rounded-xl border text-sm ${
                a.isCorrect
                  ? 'bg-green-500/10 border-green-500/30 text-green-300'
                  : 'bg-red-500/10 border-red-500/30 text-red-300'
              }`}
            >
              <span className="mr-2">{a.isCorrect ? '✅' : '❌'}</span>
              <span className="text-slate-300">{a.question.slice(0, 60)}...</span>
              {!a.isCorrect && (
                <span className="block mt-1 text-xs text-slate-500 pl-6">
                  Your answer: {a.selected} · Correct: {a.correct}
                </span>
              )}
            </motion.div>
          ))}
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/')}
            className="py-3 rounded-xl border border-white/20 text-white font-semibold hover:bg-white/10 transition-all"
          >
            ← New Test
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/test', { state: { questions: answers.map(a => ({
              question: a.question,
              options: [],
              correct: a.correct
            })), topic } })}
            className="py-3 rounded-xl bg-gradient-to-r from-brand-500 to-ai-500 text-white font-semibold hover:opacity-90 transition-all"
          >
            Retry →
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}