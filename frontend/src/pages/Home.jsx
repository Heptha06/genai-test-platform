import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Home() {
  const navigate = useNavigate()
  const [topic, setTopic] = useState('')
  const [difficulty, setDifficulty] = useState('medium')
  const [count, setCount] = useState(5)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleStart = async () => {
    if (!topic.trim()) {
      setError('Please enter a topic!')
      return
    }
    setError('')
    setLoading(true)
    try {
      const res = await fetch('http://localhost:8000/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, difficulty, count })
      })
      const data = await res.json()
      navigate('/test', { state: { questions: data.questions, topic } })
    } catch (err) {
      setError('Failed to generate questions. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4">
      
      {/* Glowing background orbs */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500 rounded-full opacity-10 blur-3xl" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500 rounded-full opacity-10 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 w-full max-w-lg shadow-2xl"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-ai-500/20 border border-ai-500/30 rounded-full px-4 py-1.5 mb-4">
            <span className="text-ai-400 text-sm font-semibold">✦ Powered by ChrisAI</span>
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-2">
            GenAI Test
          </h1>
          <p className="text-slate-400 text-sm">
            Enter any topic and AI will generate a quiz instantly
          </p>
        </div>

        {/* Topic Input */}
        <div className="mb-4">
          <label className="text-slate-300 text-sm font-medium mb-2 block">
            Topic
          </label>
          <input
            type="text"
            value={topic}
            onChange={e => setTopic(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleStart()}
            placeholder="e.g. Python basics, World War 2, React hooks..."
            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
          />
        </div>

        {/* Difficulty */}
        <div className="mb-4">
          <label className="text-slate-300 text-sm font-medium mb-2 block">
            Difficulty
          </label>
          <div className="grid grid-cols-3 gap-2">
            {['easy', 'medium', 'hard'].map(d => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={`py-2.5 rounded-xl text-sm font-semibold capitalize transition-all ${
                  difficulty === d
                    ? d === 'easy'
                      ? 'bg-green-500 text-white'
                      : d === 'medium'
                      ? 'bg-brand-500 text-white'
                      : 'bg-red-500 text-white'
                    : 'bg-white/10 text-slate-400 hover:bg-white/20'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Number of Questions */}
        <div className="mb-6">
          <label className="text-slate-300 text-sm font-medium mb-2 block">
            Number of Questions: <span className="text-white font-bold">{count}</span>
          </label>
          <input
            type="range"
            min="3"
            max="10"
            value={count}
            onChange={e => setCount(Number(e.target.value))}
            className="w-full accent-brand-500"
          />
          <div className="flex justify-between text-slate-500 text-xs mt-1">
            <span>3</span><span>10</span>
          </div>
        </div>

        {/* Error */}
        {error && (
          <p className="text-red-400 text-sm mb-4 text-center">{error}</p>
        )}

        {/* Start Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleStart}
          disabled={loading}
          className="w-full bg-gradient-to-r from-brand-500 to-ai-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-brand-500/25 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              Generating with AI...
            </span>
          ) : '✦ Generate & Start Test'}
        </motion.button>
      </motion.div>
    </div>
  )
}