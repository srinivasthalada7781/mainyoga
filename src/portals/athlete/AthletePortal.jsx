import React, { useState, useEffect } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import googleSheetsService from '../../services/googleSheetsService'
import './AthletePortal.css'

const AthletePortal = () => {
  const location = useLocation()
  
  const getNavLinkClass = (path) => {
    return location.pathname === `/athlete${path}` ? 'active' : ''
  }
  
  return (
    <div className="athlete-portal">
      <header className="athlete-header">
        <h1>Athlete Portal</h1>
        <nav>
          <Link to="/athlete" className={getNavLinkClass('')}>Dashboard</Link>
          <Link to="/athlete/register" className={getNavLinkClass('/register')}>Event Registration</Link>
          <Link to="/athlete/scores" className={getNavLinkClass('/scores')}>My Scores</Link>
          <Link to="/athlete/leaderboard" className={getNavLinkClass('/leaderboard')}>Leaderboard</Link>
          <Link to="/athlete/certificates" className={getNavLinkClass('/certificates')}>Certificates</Link>
        </nav>
      </header>
      
      <div className="container">
        <Routes>
          <Route path="/" element={<AthleteDashboard />} />
          <Route path="/register" element={<EventRegistration />} />
          <Route path="/scores" element={<MyScores />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/certificates" element={<Certificates />} />
        </Routes>
      </div>
    </div>
  )
}

const AthleteDashboard = () => {
  const [athleteInfo, setAthleteInfo] = useState(null)
  const [registeredEvents, setRegisteredEvents] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const fetchAthleteData = async () => {
      try {
        // For demo, we're using a fixed athlete ID
        const athlete = await googleSheetsService.getAthleteById(1)
        setAthleteInfo(athlete)
        
        // Fetch event details for registered events
        if (athlete) {
          const event = await googleSheetsService.getEventById(athlete.event_id)
          if (event) {
            setRegisteredEvents([event])
          }
        }
        
        setLoading(false)
      } catch (error) {
        console.error('Error fetching athlete data:', error)
        setLoading(false)
      }
    }
    
    fetchAthleteData()
  }, [])
  
  if (loading) {
    return <div className="loading">Loading dashboard...</div>
  }
  
  if (!athleteInfo) {
    return <div className="error">Athlete not found</div>
  }
  
  return (
    <div className="athlete-dashboard">
      <div className="athlete-profile card">
        <div className="card-header">
          <h2>Welcome, {athleteInfo.name}!</h2>
        </div>
        
        <div className="profile-info">
          <p><strong>Registration No:</strong> {athleteInfo.registration_no}</p>
          <p><strong>Age:</strong> {athleteInfo.age}</p>
          <p><strong>Member Since:</strong> January 2025</p>
        </div>
      </div>
      
      <div className="registered-events card">
        <div className="card-header">
          <h2>Your Registered Events</h2>
        </div>
        
        {registeredEvents.length === 0 ? (
          <p>You haven't registered for any events yet.</p>
        ) : (
          <div className="events-grid">
            {registeredEvents.map(event => (
              <div key={event.id} className="event-card">
                <h3>{event.name}</h3>
                <p>Category: {event.category}</p>
                <p>Age Group: {event.age_group}</p>
                <p>Asanas: {event.num_asanas}</p>
                <p>Status: <span className={`status ${event.status}`}>{event.status}</span></p>
                <div className="event-actions">
                  <Link to="/athlete/scores">
                    <button className="secondary">View Scores</button>
                  </Link>
                  <Link to="/athlete/leaderboard">
                    <button>View Leaderboard</button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="performance-summary card">
        <div className="card-header">
          <h2>Performance Summary</h2>
        </div>
        
        <div className="summary-stats">
          <div className="stat">
            <h3>3</h3>
            <p>Events Participated</p>
          </div>
          <div className="stat">
            <h3>2</h3>
            <p>Events Won</p>
          </div>
          <div className="stat">
            <h3>8.5</h3>
            <p>Average Score</p>
          </div>
        </div>
      </div>
    </div>
  )
}

const EventRegistration = () => {
  const [events, setEvents] = useState([])
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    event_id: ''
  })
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsData = await googleSheetsService.getEvents()
        setEvents(eventsData)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching events:', error)
        setLoading(false)
      }
    }
    
    fetchEvents()
  }, [])
  
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    
    try {
      const newAthlete = {
        ...formData,
        age: parseInt(formData.age),
        event_id: parseInt(formData.event_id)
      }
      
      const createdAthlete = await googleSheetsService.addAthlete(newAthlete)
      alert(`Successfully registered for ${events.find(e => e.id === createdAthlete.event_id)?.name || 'the event'}! Your registration number is ${createdAthlete.registration_no}.`)
      setFormData({ name: '', age: '', event_id: '' })
    } catch (error) {
      console.error('Error registering for event:', error)
      alert('Error registering for event. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }
  
  if (loading) {
    return <div className="loading">Loading events...</div>
  }
  
  return (
    <div className="event-registration">
      <div className="card">
        <div className="card-header">
          <h2>Event Registration</h2>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              placeholder="Enter your full name"
            />
          </div>
          
          <div className="form-group">
            <label>Age:</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              min="5"
              max="100"
              required
              placeholder="Enter your age"
            />
          </div>
          
          <div className="form-group">
            <label>Select Event:</label>
            <select
              name="event_id"
              value={formData.event_id}
              onChange={handleInputChange}
              required
            >
              <option value="">Select an event</option>
              {events.map(event => (
                <option key={event.id} value={event.id}>
                  {event.name} ({event.category}, {event.age_group})
                </option>
              ))}
            </select>
          </div>
          
          <button type="submit" disabled={submitting}>
            {submitting ? 'Registering...' : 'Register for Event'}
          </button>
        </form>
      </div>
      
      <div className="events-list card">
        <div className="card-header">
          <h2>Available Events</h2>
        </div>
        
        {events.length === 0 ? (
          <p>No events available for registration.</p>
        ) : (
          <div className="events-grid">
            {events.map(event => (
              <div key={event.id} className="event-card">
                <h3>{event.name}</h3>
                <p>Category: {event.category}</p>
                <p>Age Group: {event.age_group}</p>
                <p>Asanas: {event.num_asanas}</p>
                <p>Status: <span className={`status ${event.status}`}>{event.status}</span></p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const MyScores = () => {
  const [athleteInfo, setAthleteInfo] = useState(null)
  const [scores, setScores] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const fetchScores = async () => {
      try {
        // For demo, we're using a fixed athlete ID
        const athlete = await googleSheetsService.getAthleteById(1)
        setAthleteInfo(athlete)
        
        if (athlete) {
          const scoresData = await googleSheetsService.getJudgeScoresByAthlete(athlete.id)
          setScores(scoresData)
        }
        
        setLoading(false)
      } catch (error) {
        console.error('Error fetching scores:', error)
        setLoading(false)
      }
    }
    
    fetchScores()
  }, [])
  
  if (loading) {
    return <div className="loading">Loading scores...</div>
  }
  
  return (
    <div className="my-scores">
      <div className="card">
        <div className="card-header">
          <h2>My Scores</h2>
        </div>
        
        {athleteInfo && (
          <div className="athlete-info">
            <p><strong>Athlete:</strong> {athleteInfo.name}</p>
            <p><strong>Registration No:</strong> {athleteInfo.registration_no}</p>
          </div>
        )}
        
        {scores.length === 0 ? (
          <p>You don't have any scores yet.</p>
        ) : (
          <div className="scores-list">
            <table>
              <thead>
                <tr>
                  <th>Judge</th>
                  <th>D-Score (/8)</th>
                  <th>T-Score (/2)</th>
                  <th>Total (/10)</th>
                </tr>
              </thead>
              <tbody>
                {scores.map((score, index) => (
                  <tr key={index}>
                    <td>Judge #{score.judge_id}</td>
                    <td>{score.d_score_out_of_8 !== null ? score.d_score_out_of_8.toFixed(2) : 'N/A'}</td>
                    <td>{score.t_score_out_of_2 !== null ? score.t_score_out_of_2.toFixed(1) : 'N/A'}</td>
                    <td>{score.judge_total_out_of_10 !== null ? score.judge_total_out_of_10.toFixed(2) : 'N/A'}</td>
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

const Leaderboard = () => {
  const [events, setEvents] = useState([])
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsData = await googleSheetsService.getEvents()
        setEvents(eventsData)
        if (eventsData.length > 0) {
          setSelectedEvent(eventsData[0].id)
        }
        setLoading(false)
      } catch (error) {
        console.error('Error fetching events:', error)
        setLoading(false)
      }
    }
    
    fetchEvents()
  }, [])
  
  useEffect(() => {
    const fetchLeaderboard = async () => {
      if (!selectedEvent) return
      
      try {
        const leaderboardData = await googleSheetsService.getLeaderboard(selectedEvent)
        setLeaderboard(leaderboardData)
      } catch (error) {
        console.error('Error fetching leaderboard:', error)
      }
    }
    
    fetchLeaderboard()
  }, [selectedEvent])
  
  const handleEventChange = (eventId) => {
    setSelectedEvent(parseInt(eventId))
  }
  
  if (loading) {
    return <div className="loading">Loading leaderboard...</div>
  }
  
  return (
    <div className="leaderboard">
      <div className="card">
        <div className="card-header">
          <h2>Live Leaderboard</h2>
        </div>
        
        <div className="event-selector">
          <label>Select Event:</label>
          <select value={selectedEvent || ''} onChange={(e) => handleEventChange(e.target.value)}>
            {events.map(event => (
              <option key={event.id} value={event.id}>
                {event.name} ({event.category})
              </option>
            ))}
          </select>
        </div>
        
        {selectedEvent && (
          <div className="leaderboard-table">
            <table>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Registration No</th>
                  <th>Athlete Name</th>
                  <th>Final Score</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.length === 0 ? (
                  <tr>
                    <td colSpan="4">No results available for this event.</td>
                  </tr>
                ) : (
                  leaderboard.map(entry => (
                    <tr key={entry.athlete_id} className={entry.rank <= 3 ? `rank-${entry.rank}` : ''}>
                      <td>
                        {entry.rank === 1 ? '🥇' : 
                         entry.rank === 2 ? '🥈' : 
                         entry.rank === 3 ? '🥉' : entry.rank}
                      </td>
                      <td>{entry.registration_no}</td>
                      <td>{entry.athlete_name}</td>
                      <td>{entry.final_score.toFixed(1)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

const Certificates = () => {
  const [certificates] = useState([
    { id: 1, eventName: 'Intermediate Level I', type: 'Participation', date: '2025-11-15', registrationNo: 'ATH001' },
    { id: 2, eventName: 'Intermediate Level I', type: 'Winner', date: '2025-11-15', registrationNo: 'ATH001' },
    { id: 3, eventName: 'Regional Championship', type: 'Participation', date: '2025-12-05', registrationNo: 'ATH001' }
  ])
  
  return (
    <div className="certificates">
      <div className="card">
        <div className="card-header">
          <h2>My Certificates</h2>
        </div>
        
        {certificates.length === 0 ? (
          <p>You don't have any certificates yet.</p>
        ) : (
          <div className="certificates-list">
            {certificates.map(cert => (
              <div key={cert.id} className="certificate-card">
                <h3>{cert.eventName}</h3>
                <p>Type: <span className={`cert-type ${cert.type.toLowerCase()}`}>{cert.type}</span></p>
                <p>Registration No: {cert.registrationNo}</p>
                <p>Date: {cert.date}</p>
                <button className="secondary">Download Certificate</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AthletePortal