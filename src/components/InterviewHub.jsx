import { useState } from 'react'
import './InterviewHub.css'

export default function InterviewHub({ character, onBack }) {
  const [step, setStep] = useState('intro')
  const [userAnswer, setUserAnswer] = useState('')
  const [feedback, setFeedback] = useState('')
  const [loading, setLoading] = useState(false)

  const questions = [
    "Tell me about yourself and your professional background.",
    "What are your key strengths?",
    "Describe a challenge you overcame."
  ]

  const characterMap = {
    'friendly-coach': { name: 'Alex', color: '#667eea' },
    'technical-expert': { name: 'Jordan', color: '#f093fb' },
    'executive-recruiter': { name: 'Morgan', color: '#4facfe' }
  }

  const currentCharacter = characterMap[character] || characterMap['friendly-coach']
  const currentQuestion = questions[0]

  const handleSubmitAnswer = async () => {
    if (!userAnswer.trim()) return

    setLoading(true)
    try {
      const response = await fetch('/api/generateResponse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userMessage: userAnswer,
          voiceCharacter: character,
          question: currentQuestion
        })
      })

      const data = await response.json()
      setFeedback(data.response || 'Great answer!')
      setStep('feedback')
    } catch (error) {
      console.error('Error:', error)
      setFeedback('Error getting feedback. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handlePlayAudio = async () => {
    try {
      const response = await fetch('/api/textToSpeech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: feedback,
          voiceCharacter: character
        })
      })

      const audioBlob = await response.blob()
      const audioUrl = URL.createObjectURL(audioBlob)
      const audio = new Audio(audioUrl)
      audio.play()
    } catch (error) {
      console.error('Error playing audio:', error)
    }
  }

  return (
    <div className="interview-hub" style={{ '--accent-color': currentCharacter.color }}>
      <button className="back-btn" onClick={onBack}>← Back</button>

      <div className="interview-container">
        <div className="interviewer-section">
          <div className="interviewer-avatar">👤</div>
          <h2>{currentCharacter.name}</h2>
          <p>Interview in Progress</p>
        </div>

        <div className="interview-content">
          {step === 'intro' && (
            <div className="step-intro">
              <h3>Ready for your interview?</h3>
              <p>I'll ask you a series of questions. Answer honestly and thoughtfully.</p>
              <button className="btn-primary" onClick={() => setStep('question')}>
                Start Interview
              </button>
            </div>
          )}

          {step === 'question' && (
            <div className="step-question">
              <div className="question-box">
                <p className="question-text">{currentQuestion}</p>
              </div>
              <textarea
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Type your answer here..."
                className="answer-input"
                rows="6"
              />
              <button
                className="btn-primary"
                onClick={handleSubmitAnswer}
                disabled={loading}
              >
                {loading ? 'Getting Feedback...' : 'Submit Answer'}
              </button>
            </div>
          )}

          {step === 'feedback' && (
            <div className="step-feedback">
              <div className="feedback-box">
                <h3>Feedback from {currentCharacter.name}</h3>
                <p>{feedback}</p>
              </div>
              <div className="feedback-actions">
                <button className="btn-secondary" onClick={handlePlayAudio}>
                  🔊 Hear Feedback
                </button>
                <button className="btn-primary" onClick={() => {
                  setStep('question')
                  setUserAnswer('')
                  setFeedback('')
                }}>
                  Next Question
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
