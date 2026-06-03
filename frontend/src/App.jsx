import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import TestPage from './pages/TestPage'
import Results from './pages/Results'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/test" element={<TestPage />} />
        <Route path="/results" element={<Results />} />
      </Routes>
    </BrowserRouter>
  )
}