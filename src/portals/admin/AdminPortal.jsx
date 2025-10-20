import React, { useState, useEffect } from 'react'
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom'
import googleSheetsService from '../../services/googleSheetsService'
import './AdminPortal.css'

const AdminPortal = () => {
  const location = useLocation()
  
  const getNavLinkClass = (path) => {
    return location.pathname === `/admin${path}` ? 'active' : ''
  }
  
  return (
    <div className="admin-portal">
      <header className="admin-header">
        <h1>Admin Portal</h1>
        <nav>
          <Link to="/admin" className={getNavLinkClass('')}>Dashboard</Link>
          <Link to="/admin/events" className={getNavLinkClass('/events')}>Events</Link>
          <Link to="/admin/judges" className={getNavLinkClass('/judges')}>Judges</Link>
          <Link to="/admin/athletes" className={getNavLinkClass('/athletes')}>Athletes</Link>
          <Link to="/admin/results" className={getNavLinkClass('/results')}>Results</Link>
        </nav>
      </header>
      
      <div className="container">
        <Routes>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="/events" element={<EventManagement />} />
          <Route path="/judges" element={<JudgeManagement />} />
          <Route path="/athletes" element={<AthleteManagement />} />
          <Route path="/results" element={<ResultsDashboard />} />
        </Routes>
      </div>
    </div>
  )
}

const AdminDashboard = () => {
  const [stats, setStats] = useState({ events: 0, judges: 0, athletes: 0 })
  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [events, judges, athletes] = await Promise.all([
          googleSheetsService.getEvents(),
          googleSheetsService.getJudges(),
          googleSheetsService.getAthletes()
        ])
        
        setStats({
          events: events.length,
          judges: judges.length,
          athletes: athletes.length
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
      }
    }
    
    fetchStats()
  }, [])
  
  return (
    <div className="admin-dashboard">
      <div className="card">
        <div className="card-header">
          <h2>Competition Dashboard</h2>
        </div>
        
        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>{stats.events}</h3>
            <p>Active Events</p>
          </div>
          <div className="stat-card">
            <h3>{stats.judges}</h3>
            <p>Registered Judges</p>
          </div>
          <div className="stat-card">
            <h3>{stats.athletes}</h3>
            <p>Registered Athletes</p>
          </div>
        </div>
      </div>
      
      <div className="recent-activity card">
        <div className="card-header">
          <h2>Recent Activity</h2>
        </div>
        <ul>
          <li>New athlete registration: Priya Sharma</li>
          <li>Judge score submitted: Event #3, Asana Round</li>
          <li>Event created: Senior Level II</li>
          <li>Athlete certificate generated: Rahul Mehta</li>
          <li>Judge assigned to event: Dr. Anil Kumar → Intermediate Level I</li>
        </ul>
      </div>
    </div>
  )
}

const EventManagement = () => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    ageGroup: '',
    asanas: ''
  })
  
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
    try {
      const newEvent = {
        ...formData,
        asanas: parseInt(formData.asanas)
      }
      
      const createdEvent = await googleSheetsService.addEvent(newEvent)
      setEvents([...events, createdEvent])
      setFormData({ name: '', category: '', ageGroup: '', asanas: '' })
      setShowForm(false)
    } catch (error) {
      console.error('Error creating event:', error)
      alert('Error creating event. Please try again.')
    }
  }
  
  const handleDelete = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await googleSheetsService.deleteEvent(eventId)
        setEvents(events.filter(event => event.id !== eventId))
      } catch (error) {
        console.error('Error deleting event:', error)
        alert('Error deleting event. Please try again.')
      }
    }
  }
  
  if (loading) {
    return <div className="loading">Loading events...</div>
  }
  
  return (
    <div className="event-management">
      <div className="header">
        <h2>Event Management</h2>
        <button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Create New Event'}
        </button>
      </div>
      
      {showForm && (
        <form onSubmit={handleSubmit} className="event-form card">
          <div className="card-header">
            <h2>Create New Event</h2>
          </div>
          
          <div className="form-group">
            <label>Event Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Category:</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Category</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Senior">Senior</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Age Group:</label>
            <input
              type="text"
              name="ageGroup"
              value={formData.ageGroup}
              onChange={handleInputChange}
              placeholder="e.g., 10-15"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Number of Asanas:</label>
            <input
              type="number"
              name="asanas"
              value={formData.asanas}
              onChange={handleInputChange}
              min="1"
              max="20"
              required
            />
          </div>
          
          <button type="submit">Create Event</button>
        </form>
      )}
      
      <div className="events-list card">
        <div className="card-header">
          <h2>Current Events</h2>
        </div>
        
        {events.length === 0 ? (
          <p>No events found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Category</th>
                <th>Age Group</th>
                <th>Asanas</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map(event => (
                <tr key={event.id}>
                  <td>{event.id}</td>
                  <td>{event.name}</td>
                  <td>{event.category}</td>
                  <td>{event.ageGroup}</td>
                  <td>{event.asanas}</td>
                  <td>
                    <button className="secondary">Edit</button>
                    <button className="danger" onClick={() => handleDelete(event.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

const JudgeManagement = () => {
  const [judges, setJudges] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const fetchJudges = async () => {
      try {
        const judgesData = await googleSheetsService.getJudges()
        setJudges(judgesData)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching judges:', error)
        setLoading(false)
      }
    }
    
    fetchJudges()
  }, [])
  
  if (loading) {
    return <div className="loading">Loading judges...</div>
  }
  
  return (
    <div className="judge-management">
      <div className="judges-list card">
        <div className="card-header">
          <h2>Judge Management</h2>
        </div>
        
        {judges.length === 0 ? (
          <p>No judges found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Type</th>
                <th>Assigned Events</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {judges.map(judge => (
                <tr key={judge.id}>
                  <td>{judge.id}</td>
                  <td>{judge.name}</td>
                  <td>{judge.type}</td>
                  <td>{judge.assignedEvents.join(', ')}</td>
                  <td>
                    <button className="secondary">Edit</button>
                    <button className="danger">Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      
      <div className="add-judge card">
        <div className="card-header">
          <h2>Add New Judge</h2>
        </div>
        
        <form className="form-group">
          <div className="form-group">
            <label>Judge Name:</label>
            <input type="text" />
          </div>
          
          <div className="form-group">
            <label>Judge Type:</label>
            <select>
              <option value="D-Judge">D-Judge (Difficulty)</option>
              <option value="T-Judge">T-Judge (Technical)</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Assign to Events:</label>
            <select multiple>
              <option>Beginner Level I</option>
              <option>Intermediate Level I</option>
              <option>Senior Level I</option>
            </select>
          </div>
          
          <button type="submit">Add Judge</button>
        </form>
      </div>
    </div>
  )
}

const AthleteManagement = () => {
  const [athletes, setAthletes] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const fetchAthletes = async () => {
      try {
        const athletesData = await googleSheetsService.getAthletes()
        setAthletes(athletesData)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching athletes:', error)
        setLoading(false)
      }
    }
    
    fetchAthletes()
  }, [])
  
  if (loading) {
    return <div className="loading">Loading athletes...</div>
  }
  
  return (
    <div className="athlete-management">
      <div className="registration-requests card">
        <div className="card-header">
          <h2>Pending Registrations</h2>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Age</th>
              <th>Category</th>
              <th>Requested Events</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Ankit Singh</td>
              <td>18</td>
              <td>Intermediate</td>
              <td>Intermediate Level I</td>
              <td>
                <button className="success">Approve</button>
                <button className="danger">Reject</button>
              </td>
            </tr>
            <tr>
              <td>Pooja Patel</td>
              <td>13</td>
              <td>Beginner</td>
              <td>Beginner Level I</td>
              <td>
                <button className="success">Approve</button>
                <button className="danger">Reject</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div className="approved-athletes card">
        <div className="card-header">
          <h2>Approved Athletes</h2>
        </div>
        
        {athletes.length === 0 ? (
          <p>No athletes found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Age</th>
                <th>Category</th>
                <th>Registered Events</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {athletes.map(athlete => (
                <tr key={athlete.id}>
                  <td>{athlete.id}</td>
                  <td>{athlete.name}</td>
                  <td>{athlete.age}</td>
                  <td>{athlete.category}</td>
                  <td>{athlete.events.join(', ')}</td>
                  <td>
                    <button className="secondary">Edit</button>
                    <button className="danger">Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

const ResultsDashboard = () => {
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        // For demo purposes, we're using a fixed event ID
        const leaderboardData = await googleSheetsService.getLeaderboard(2)
        setLeaderboard(leaderboardData)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching leaderboard:', error)
        setLoading(false)
      }
    }
    
    fetchLeaderboard()
  }, [])
  
  if (loading) {
    return <div className="loading">Loading results...</div>
  }
  
  return (
    <div className="results-dashboard">
      <div className="live-leaderboard card">
        <div className="card-header">
          <h2>Live Scoring Dashboard</h2>
        </div>
        
        <h3>Top 10 Leaderboard - Intermediate Level I</h3>
        {leaderboard.length === 0 ? (
          <p>No results available.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Athlete Name</th>
                <th>Final Score</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map(entry => (
                <tr key={entry.rank}>
                  <td>{entry.rank}</td>
                  <td>{entry.athleteName}</td>
                  <td>{entry.finalScore}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      
      <div className="export-options card">
        <div className="card-header">
          <h2>Export Results</h2>
        </div>
        
        <div className="grid grid-cols-2">
          <button className="success">Export as CSV</button>
          <button className="secondary">Export as PDF</button>
        </div>
      </div>
    </div>
  )
}

export default AdminPortal