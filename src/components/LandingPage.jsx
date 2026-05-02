import './LandingPage.css'

export default function LandingPage({ onStartInterview }) {
  const characters = [
    { id: 'friendly-coach', name: 'Alex', title: 'Friendly Coach', icon: '🎯' },
    { id: 'technical-expert', name: 'Jordan', title: 'Technical Expert', icon: '💻' },
    { id: 'executive-recruiter', name: 'Morgan', title: 'Executive Recruiter', icon: '🎩' }
  ]

  return (
    <div className="landing">
      <div className="landing-hero">
        <h1>Plexus</h1>
        <p>Master your interviews with AI-powered feedback</p>
      </div>

      <div className="landing-content">
        <h2>Choose Your Interviewer</h2>
        <div className="characters-grid">
          {characters.map(char => (
            <button
              key={char.id}
              className="character-card"
              onClick={() => onStartInterview(char.id)}
            >
              <div className="character-icon">{char.icon}</div>
              <h3>{char.name}</h3>
              <p>{char.title}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
