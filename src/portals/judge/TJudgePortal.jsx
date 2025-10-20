import React, { useState, useEffect } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import googleSheetsService from '../../services/googleSheetsService'
import './JudgePortal.css'

const TJudgePortal = () => {
  const location = useLocation()
  
  const getNavLinkClass = (path) => {
    return location.pathname === `/tjudge${path}` ? 'active' : ''
  }
  
  return (
    <div className="judge-portal">
      <header className="judge-header">
        <h1>T-Judge Portal (Technical Scoring)</h1>
        <nav>
          <Link to="/tjudge" className={getNavLinkClass('')}>Dashboard</Link>
          <Link to="/tjudge/scores" className={getNavLinkClass('/scores')}>Enter Scores</Link>
          <Link to="/tjudge/history" className={getNavLinkClass('/history')}>Scoring History</Link>
        </nav>
      </header>
      
      <div className="container">
        <Routes>
          <Route path="/" element={<JudgeDashboard />} />
          <Route path="/scores" element={<EnterScores />} />
          <Route path="/history" element={<ScoringHistory />} />
        </Routes>
      </div>
    </div>
  )
}

const JudgeDashboard = () => {
  const [assignedEvents, setAssignedEvents] = useState([])
  const [pendingScores, setPendingScores] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // For demo, we're using mock data
        const events = await googleSheetsService.getEvents()
        const athletes = await googleSheetsService.getAthletes()
        
        // Filter events assigned to this judge
        const assignedEventsData = events.filter(event => event.id <= 2) // Mock assignment
        setAssignedEvents(assignedEventsData)
        
        // Create pending scores based on athletes in assigned events
        const pendingScoresData = athletes
          .filter(athlete => assignedEventsData.some(event => event.id === athlete.event_id))
          .map(athlete => {
            const event = assignedEventsData.find(e => e.id === athlete.event_id)
            return {
              athleteId: athlete.id,
              athleteName: athlete.name,
              eventId: athlete.event_id,
              eventName: event ? event.name : 'Unknown Event'
            }
          })
        
        setPendingScores(pendingScoresData)
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
          <h2>Welcome, T-Judge!</h2>
        </div>
        
        <p><strong>Judge Type:</strong> Technical Judge (T-Judge)</p>
        <p><strong>Events Assigned:</strong> {assignedEvents.length}</p>
        <p><strong>Pending Scores:</strong> {pendingScores.length}</p>
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
                <p>Category: {event.category}</p>
                <p>Age Group: {event.age_group}</p>
                <p>Asanas: {event.num_asanas}</p>
                <p>Status: <span className={`status ${event.status}`}>{event.status}</span></p>
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
                  <p><strong>Athlete:</strong> {score.athleteName}</p>
                  <p><strong>Event:</strong> {score.eventName}</p>
                </div>
                <Link to="/tjudge/scores">
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

const EnterScores = () => {
  const [selectedAthlete, setSelectedAthlete] = useState(null)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [athletes, setAthletes] = useState([])
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [athletesData, eventsData] = await Promise.all([
          googleSheetsService.getAthletes(),
          googleSheetsService.getEvents()
        ])
        
        setAthletes(athletesData)
        setEvents(eventsData)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error)
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])
  
  const handleAthleteSelect = (athleteId) => {
    const athlete = athletes.find(a => a.id === parseInt(athleteId))
    setSelectedAthlete(athlete)
    
    if (athlete) {
      const event = events.find(e => e.id === athlete.event_id)
      setSelectedEvent(event)
    }
  }
  
  if (loading) {
    return <div className="loading">Loading scoring interface...</div>
  }
  
  return (
    <div className="enter-scores">
      <div className="card">
        <div className="card-header">
          <h2>Enter Technical Scores</h2>
        </div>
        
        <div className="score-selection">
          <div className="form-group">
            <label>Select Athlete:</label>
            <select onChange={(e) => handleAthleteSelect(e.target.value)} value={selectedAthlete?.id || ''}>
              <option value="">Select an athlete</option>
              {athletes.map(athlete => {
                const event = events.find(e => e.id === athlete.event_id)
                return (
                  <option key={athlete.id} value={athlete.id}>
                    {athlete.name} - {event ? event.name : 'Unknown Event'}
                  </option>
                )
              })}
            </select>
          </div>
        </div>
        
        {selectedAthlete && selectedEvent ? (
          <EnterTScores 
            athlete={selectedAthlete} 
            event={selectedEvent} 
          />
        ) : (
          <div className="instructions">
            <h3>Instructions for T-Judges</h3>
            <ul>
              <li>Enter technique/presentation scores on a scale of 0-2</li>
              <li>Consider overall performance, form, and presentation</li>
              <li>Score will be added to the D-Score to calculate the final judge total</li>
            </ul>
          </div>
        )}
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
      // Save judge score with T score
      const judgeScore = {
        athlete_id: athlete.id,
        judge_id: 2, // Mock judge ID for T judge
        d_score_out_of_8: null,
        t_score_out_of_2: parseFloat(techScore),
        judge_total_out_of_10: parseFloat(techScore)
      }
      
      await googleSheetsService.addJudgeScore(judgeScore)
      
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
      <div className="scoring-header">
        <p><strong>Athlete:</strong> {athlete.name}</p>
        <p><strong>Event:</strong> {event.name}</p>
        <p><strong>Registration No:</strong> {athlete.registration_no}</p>
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
          <div className="score-info">
            <p><strong>Scoring Guide:</strong></p>
            <ul>
              <li>0.0-0.5: Poor technique/presentation</li>
              <li>0.6-1.0: Below average technique/presentation</li>
              <li>1.1-1.5: Average technique/presentation</li>
              <li>1.6-2.0: Excellent technique/presentation</li>
            </ul>
          </div>
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
  )
}

const ScoringHistory = () => {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const scoresData = await googleSheetsService.getJudgeScores()
        const athletesData = await googleSheetsService.getAthletes()
        const eventsData = await googleSheetsService.getEvents()
        
        // Filter for T judge scores only (where t_score_out_of_2 is not null)
        const tJudgeScores = scoresData.filter(score => score.t_score_out_of_2 !== null)
        
        // Combine data for display
        const historyData = tJudgeScores.map(score => {
          const athlete = athletesData.find(a => a.id === score.athlete_id)
          const event = eventsData.find(e => e.id === athlete?.event_id)
          
          return {
            ...score,
            athlete_name: athlete ? athlete.name : 'Unknown Athlete',
            event_name: event ? event.name : 'Unknown Event',
            registration_no: athlete ? athlete.registration_no : 'N/A'
          }
        })
        
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
                  <th>Registration No</th>
                  <th>Event</th>
                  <th>T-Score</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {history.map((entry, index) => (
                  <tr key={index}>
                    <td>2025-10-15</td>
                    <td>{entry.athlete_name}</td>
                    <td>{entry.registration_no}</td>
                    <td>{entry.event_name}</td>
                    <td>{entry.t_score_out_of_2 !== null ? entry.t_score_out_of_2.toFixed(1) : 'N/A'}</td>
                    <td>{entry.judge_total_out_of_10 !== null ? entry.judge_total_out_of_10.toFixed(1) : 'N/A'}</td>
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

export default TJudgePortal