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
          <Link to="/athlete/certificates" className={getNavLinkClass('/certificates')}>Certificates</Link>
        </nav>
      </header>
      
      <div className="container">
        <Routes>
          <Route path="/" element={<AthleteDashboard />} />
          <Route path="/register" element={<EventRegistration />} />
          <Route path="/scores" element={<MyScores />} />
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
        if (athlete && athlete.events) {
          const eventsData = await googleSheetsService.getEvents()
          const registeredEventsData = eventsData.filter(event => 
            athlete.events.includes(event.name)
          )
          setRegisteredEvents(registeredEventsData)
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
          <p><strong>Age:</strong> {athleteInfo.age}</p>
          <p><strong>Category:</strong> {athleteInfo.category}</p>
          <p><strong>Member Since:</strong> January 2025</p>
          <p><strong>Last Competition:</strong> Regional Championship 2024</p>
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
                <p>Age Group: {event.ageGroup}</p>
                <p>Asanas: {event.asanas}</p>
                <p>Status: <span className="status upcoming">Upcoming</span></p>
                <button className="secondary">View Details</button>
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
  const [availableEvents, setAvailableEvents] = useState([])
  const [selectedEvents, setSelectedEvents] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsData = await googleSheetsService.getEvents()
        setAvailableEvents(eventsData)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching events:', error)
        setLoading(false)
      }
    }
    
    fetchEvents()
  }, [])
  
  const toggleEventSelection = (eventId) => {
    if (selectedEvents.includes(eventId)) {
      setSelectedEvents(selectedEvents.filter(id => id !== eventId))
    } else {
      setSelectedEvents([...selectedEvents, eventId])
    }
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      // In a real app, this would send the registration to the backend
      alert(`Registered for ${selectedEvents.length} events!`)
    } catch (error) {
      console.error('Error registering for events:', error)
      alert('Error registering for events. Please try again.')
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
          {availableEvents.length === 0 ? (
            <p>No events available for registration.</p>
          ) : (
            <div className="events-list">
              <h3>Available Events</h3>
              {availableEvents.map(event => (
                <div key={event.id} className="event-item">
                  <input
                    type="checkbox"
                    id={`event-${event.id}`}
                    checked={selectedEvents.includes(event.id)}
                    onChange={() => toggleEventSelection(event.id)}
                  />
                  <label htmlFor={`event-${event.id}`}>
                    <h4>{event.name}</h4>
                    <div className="event-details">
                      <span>Category: {event.category}</span>
                      <span>Age Group: {event.ageGroup}</span>
                      <span>Asanas: {event.asanas}</span>
                    </div>
                  </label>
                </div>
              ))}
            </div>
          )}
          
          <button type="submit" disabled={selectedEvents.length === 0}>
            Register for Selected Events
          </button>
        </form>
      </div>
    </div>
  )
}

const MyScores = () => {
  const [scores, setScores] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const fetchScores = async () => {
      try {
        // For demo, we're using a fixed athlete ID
        const scoresData = await googleSheetsService.getScoresByAthleteId(1)
        setScores(scoresData)
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
  
  // Group scores by event for display
  const groupedScores = scores.reduce((acc, score) => {
    if (!acc[score.eventId]) {
      acc[score.eventId] = []
    }
    acc[score.eventId].push(score)
    return acc
  }, {})
  
  return (
    <div className="my-scores">
      <div className="card">
        <div className="card-header">
          <h2>My Scores</h2>
        </div>
        
        {scores.length === 0 ? (
          <p>You don't have any scores yet.</p>
        ) : (
          <div className="scores-list">
            {Object.entries(groupedScores).map(([eventId, eventScores]) => (
              <div key={eventId} className="score-card">
                <div className="score-header">
                  <h3>Event #{eventId}</h3>
                  <div className="final-score">
                    <span>Final Score: <strong>{
                      googleSheetsService.calculateFinalScore(eventScores).toFixed(1)
                    }</strong></span>
                  </div>
                </div>
                
                <div className="score-details">
                  <div className="judges-scores">
                    <h4>Judge Scores</h4>
                    {eventScores.map((score, index) => (
                      <div key={index} className="judge-score">
                        <span>Judge #{score.judgeId} ({score.type}):</span>
                        <span>{score.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const Certificates = () => {
  const [certificates] = useState([
    { id: 1, eventName: 'Intermediate Level I', type: 'Participation', date: '2025-11-15' },
    { id: 2, eventName: 'Intermediate Level I', type: 'Winner', date: '2025-11-15' },
    { id: 3, eventName: 'Regional Championship', type: 'Participation', date: '2025-12-05' }
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