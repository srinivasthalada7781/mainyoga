import React, { useState, useEffect } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import googleSheetsService from '../../services/googleSheetsService'
import './JudgePortal.css'

const JudgePortal = () => {
  const [judgeType, setJudgeType] = useState('D-Judge') // or 'T-Judge'
  const location = useLocation()
  
  const getNavLinkClass = (path) => {
    return location.pathname === `/judge${path}` ? 'active' : ''
  }
  
  return (
    <div className="judge-portal">
      <header className="judge-header">
        <h1>Judge Portal</h1>
        <nav>
          <Link to="/judge" className={getNavLinkClass('')}>Dashboard</Link>
          <Link to="/judge/scores" className={getNavLinkClass('/scores')}>Enter Scores</Link>
          <Link to="/judge/history" className={getNavLinkClass('/history')}>Scoring History</Link>
        </nav>
      </header>
      
      <div className="container">
        <Routes>
          <Route path="/" element={<JudgeDashboard judgeType={judgeType} />} />
          <Route path="/scores" element={<EnterScores judgeType={judgeType} />} />
          <Route path="/history" element={<ScoringHistory />} />
        </Routes>
      </div>
    </div>
  )
}

const JudgeDashboard = ({ judgeType }) => {
  const [assignedEvents, setAssignedEvents] = useState([])
  const [pendingScores, setPendingScores] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // For demo, we're using mock data
        setAssignedEvents([
          { id: 1, name: 'Intermediate Level I', date: '2025-11-15', venue: 'Main Hall A' },
          { id: 2, name: 'Senior Level I', date: '2025-11-20', venue: 'Main Hall B' }
        ])
        
        setPendingScores([
          { athlete: 'Priya Sharma', event: 'Intermediate Level I', asana: 3 },
          { athlete: 'Ravi Kumar', event: 'Intermediate Level I', asana: 5 },
          { athlete: 'Sneha Patel', event: 'Senior Level I', asana: 2 }
        ])
        
        setLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error)
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])
  
  if (loading) {
    return <div className="loading">Loading dashboard...</div>
  }
  
  return (
    <div className="judge-dashboard">
      <div className="judge-info card">
        <div className="card-header">
          <h2>Welcome, Judge!</h2>
        </div>
        
        <p>Judge Type: <strong>{judgeType}</strong></p>
        <p>Events Assigned: <strong>{assignedEvents.length}</strong></p>
        <p>Pending Scores: <strong>{pendingScores.length}</strong></p>
      </div>
      
      <div className="assigned-events card">
        <div className="card-header">
          <h2>Your Assigned Events</h2>
        </div>
        
        {assignedEvents.length === 0 ? (
          <p>You have not been assigned to any events yet.</p>
        ) : (
          <div className="events-list">
            {assignedEvents.map(event => (
              <div key={event.id} className="event-card">
                <h3>{event.name}</h3>
                <p>Date: {event.date}</p>
                <p>Venue: {event.venue}</p>
                <button className="secondary">View Details</button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="pending-scores card">
        <div className="card-header">
          <h2>Pending Scores to Enter</h2>
        </div>
        
        {pendingScores.length === 0 ? (
          <p>No pending scores to enter.</p>
        ) : (
          <div className="scores-list">
            {pendingScores.map((score, index) => (
              <div key={index} className="score-item">
                <div>
                  <p><strong>Athlete:</strong> {score.athlete}</p>
                  <p><strong>Event:</strong> {score.event}</p>
                  {judgeType === 'D-Judge' && <p><strong>Asana:</strong> #{score.asana}</p>}
                </div>
                <Link to="/judge/scores">
                  <button>Enter Score</button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const EnterScores = ({ judgeType }) => {
  const [currentAthlete] = useState('Priya Sharma')
  const [currentEvent] = useState('Intermediate Level I')
  
  if (judgeType === 'D-Judge') {
    return <EnterDScores athlete={currentAthlete} event={currentEvent} />
  } else {
    return <EnterTScores athlete={currentAthlete} event={currentEvent} />
  }
}

const EnterDScores = ({ athlete, event }) => {
  const [asanaScores, setAsanaScores] = useState([
    { id: 1, name: 'Tadasana', score: '' },
    { id: 2, name: 'Vrikshasana', score: '' },
    { id: 3, name: 'Utkatasana', score: '' },
    { id: 4, name: 'Ashtanga Namaskara', score: '' },
    { id: 5, name: 'Bhujangasana', score: '' },
    { id: 6, name: 'Adho Mukha Svanasana', score: '' },
    { id: 7, name: 'Virabhadrasana I', score: '' }
  ])
  
  const handleScoreChange = (asanaId, value) => {
    const numValue = parseFloat(value) || 0
    if (numValue >= 0 && numValue <= 10) {
      setAsanaScores(asanaScores.map(asana => 
        asana.id === asanaId ? { ...asana, score: value } : asana
      ))
    }
  }
  
  const calculateTotal = () => {
    const scoredAsanas = asanaScores.filter(a => a.score !== '')
    if (scoredAsanas.length === 0) return 0
    
    const totalScore = scoredAsanas.reduce((sum, asana) => sum + (parseFloat(asana.score) || 0), 0)
    const maxPossible = scoredAsanas.length * 10
    return (totalScore / maxPossible) * 8
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const total = calculateTotal()
      
      // In a real app, this would send the scores to the backend
      const scoreData = {
        athleteId: 1, // Mock athlete ID
        eventId: 2,   // Mock event ID
        judgeId: 1,   // Mock judge ID
        type: 'D-Score',
        value: total,
        asanaScores: asanaScores.map(a => ({
          name: a.name,
          score: parseFloat(a.score) || 0
        }))
      }
      
      await googleSheetsService.addScore(scoreData)
      alert(`D-Score calculated: ${total.toFixed(2)}\nScores submitted successfully!`)
      
      // Reset form
      setAsanaScores(asanaScores.map(a => ({ ...a, score: '' })))
    } catch (error) {
      console.error('Error submitting scores:', error)
      alert('Error submitting scores. Please try again.')
    }
  }
  
  return (
    <div className="enter-d-scores">
      <div className="card">
        <div className="card-header">
          <h2>Enter Difficulty Scores (D-Judge)</h2>
        </div>
        
        <div className="scoring-header">
          <p><strong>Athlete:</strong> {athlete}</p>
          <p><strong>Event:</strong> {event}</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="asana-scores">
            <h3>Asana Scores (0-10 each)</h3>
            <div className="scores-grid">
              {asanaScores.map(asana => (
                <div key={asana.id} className="asana-score">
                  <label>{asana.name}</label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    value={asana.score}
                    onChange={(e) => handleScoreChange(asana.id, e.target.value)}
                    placeholder="0-10"
                  />
                </div>
              ))}
            </div>
          </div>
          
          <div className="score-summary">
            <div className="total-score">
              <h3>Calculated D-Score: <span>{calculateTotal().toFixed(2)}</span>/8</h3>
              <p>(Formula: Sum of Asana Marks / Total Possible Marks × 8)</p>
            </div>
            
            <button type="submit" disabled={asanaScores.every(a => a.score === '')}>
              Submit Scores
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const EnterTScores = ({ athlete, event }) => {
  const [techScore, setTechScore] = useState('')
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (techScore === '' || isNaN(techScore) || techScore < 0 || techScore > 2) {
      alert('Please enter a valid technical score between 0 and 2')
      return
    }
    
    try {
      // In a real app, this would send the score to the backend
      const scoreData = {
        athleteId: 1, // Mock athlete ID
        eventId: 2,   // Mock event ID
        judgeId: 2,   // Mock judge ID
        type: 'T-Score',
        value: parseFloat(techScore)
      }
      
      await googleSheetsService.addScore(scoreData)
      alert(`T-Score submitted: ${techScore}\nScores submitted successfully!`)
      
      // Reset form
      setTechScore('')
    } catch (error) {
      console.error('Error submitting score:', error)
      alert('Error submitting score. Please try again.')
    }
  }
  
  return (
    <div className="enter-t-scores">
      <div className="card">
        <div className="card-header">
          <h2>Enter Technical Score (T-Judge)</h2>
        </div>
        
        <div className="scoring-header">
          <p><strong>Athlete:</strong> {athlete}</p>
          <p><strong>Event:</strong> {event}</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="tech-score-input">
            <label htmlFor="techScore">Technical Performance Score (0-2):</label>
            <input
              type="number"
              id="techScore"
              min="0"
              max="2"
              step="0.1"
              value={techScore}
              onChange={(e) => setTechScore(e.target.value)}
              placeholder="Enter score (0-2)"
              required
            />
          </div>
          
          <div className="score-summary">
            <div className="total-score">
              <h3>T-Score: <span>{techScore || '0.0'}</span>/2</h3>
            </div>
            
            <button type="submit" disabled={techScore === ''}>
              Submit Score
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const ScoringHistory = () => {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const historyData = await googleSheetsService.getScores()
        setHistory(historyData)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching scoring history:', error)
        setLoading(false)
      }
    }
    
    fetchHistory()
  }, [])
  
  if (loading) {
    return <div className="loading">Loading scoring history...</div>
  }
  
  return (
    <div className="scoring-history">
      <div className="card">
        <div className="card-header">
          <h2>Scoring History</h2>
        </div>
        
        {history.length === 0 ? (
          <p>No scoring history available.</p>
        ) : (
          <div className="history-table">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Athlete</th>
                  <th>Event</th>
                  <th>Score Type</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                {history.map((entry, index) => (
                  <tr key={index}>
                    <td>2025-11-15</td>
                    <td>Athlete #{entry.athleteId}</td>
                    <td>Event #{entry.eventId}</td>
                    <td>{entry.type}</td>
                    <td>{entry.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default JudgePortal