import './App.css'
import LandingPage from './components/LandingPage'
import InterviewHub from './components/InterviewHub'
import { useState } from 'react'

function App() {
  const [currentPage, setCurrentPage] = useState('landing')
  const [selectedCharacter, setSelectedCharacter] = useState(null)

  const handleStartInterview = (character) => {
    setSelectedCharacter(character)
    setCurrentPage('interview')
  }

  const handleBackToLanding = () => {
    setCurrentPage('landing')
    setSelectedCharacter(null)
  }

  return (
    <div className="app">
      {currentPage === 'landing' ? (
        <LandingPage onStartInterview={handleStartInterview} />
      ) : (
        <InterviewHub character={selectedCharacter} onBack={handleBackToLanding} />
      )}
    </div>
  )
}

export default App
