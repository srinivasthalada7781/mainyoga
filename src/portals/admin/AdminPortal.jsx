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
          <Link to="/admin/notifications" className={getNavLinkClass('/notifications')}>Notifications</Link>
        </nav>
      </header>
      
      <div className="container">
        <Routes>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="/events" element={<EventManagement />} />
          <Route path="/judges" element={<JudgeManagement />} />
          <Route path="/athletes" element={<AthleteManagement />} />
          <Route path="/results" element={<ResultsDashboard />} />
          <Route path="/notifications" element={<NotificationSystem />} />
        </Routes>
      </div>
    </div>
  )
}

const AdminDashboard = () => {
  const [stats, setStats] = useState({ events: 0, judges: 0, athletes: 0 })
  const [recentEvents, setRecentEvents] = useState([])
  
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
        
        // Get recent events (last 3)
        const sortedEvents = [...events].sort((a, b) => 
          new Date(b.created_at) - new Date(a.created_at)
        )
        setRecentEvents(sortedEvents.slice(0, 3))
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
      
      <div className="recent-events card">
        <div className="card-header">
          <h2>Recent Events</h2>
        </div>
        {recentEvents.length === 0 ? (
          <p>No events found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Age Group</th>
                <th>Asanas</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentEvents.map(event => (
                <tr key={event.id}>
                  <td>{event.name}</td>
                  <td>{event.category}</td>
                  <td>{event.age_group}</td>
                  <td>{event.num_asanas}</td>
                  <td>
                    <span className={`status ${event.status}`}>
                      {event.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      
      <div className="quick-actions card">
        <div className="card-header">
          <h2>Quick Actions</h2>
        </div>
        <div className="actions-grid">
          <Link to="/admin/events" className="action-card">
            <h3>Manage Events</h3>
            <p>Create and manage competition events</p>
          </Link>
          <Link to="/admin/judges" className="action-card">
            <h3>Manage Judges</h3>
            <p>Add and assign judges to events</p>
          </Link>
          <Link to="/admin/athletes" className="action-card">
            <h3>Manage Athletes</h3>
            <p>View and approve athlete registrations</p>
          </Link>
          <Link to="/admin/results" className="action-card">
            <h3>View Results</h3>
            <p>Check live scoring and leaderboards</p>
          </Link>
        </div>
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
    age_group: '',
    num_asanas: ''
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
        num_asanas: parseInt(formData.num_asanas)
      }
      
      const createdEvent = await googleSheetsService.addEvent(newEvent)
      setEvents([...events, createdEvent])
      setFormData({ name: '', category: '', age_group: '', num_asanas: '' })
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
              name="age_group"
              value={formData.age_group}
              onChange={handleInputChange}
              placeholder="e.g., 10-15"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Number of Asanas:</label>
            <input
              type="number"
              name="num_asanas"
              value={formData.num_asanas}
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
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map(event => (
                <tr key={event.id}>
                  <td>{event.id}</td>
                  <td>{event.name}</td>
                  <td>{event.category}</td>
                  <td>{event.age_group}</td>
                  <td>{event.num_asanas}</td>
                  <td>
                    <span className={`status ${event.status}`}>
                      {event.status}
                    </span>
                  </td>
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
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    role: 'D',
    assigned_events: []
  })
  
  useEffect(() => {
    const fetchJudgesAndEvents = async () => {
      try {
        const [judgesData, eventsData] = await Promise.all([
          googleSheetsService.getJudges(),
          googleSheetsService.getEvents()
        ])
        
        setJudges(judgesData)
        setEvents(eventsData)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching judges and events:', error)
        setLoading(false)
      }
    }
    
    fetchJudgesAndEvents()
  }, [])
  
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  const handleEventAssignment = (eventId) => {
    const eventIdInt = parseInt(eventId)
    if (formData.assigned_events.includes(eventIdInt)) {
      setFormData(prev => ({
        ...prev,
        assigned_events: prev.assigned_events.filter(id => id !== eventIdInt)
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        assigned_events: [...prev.assigned_events, eventIdInt]
      }))
    }
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const newJudge = {
        ...formData,
        assigned_events: formData.assigned_events.map(id => parseInt(id))
      }
      
      const createdJudge = await googleSheetsService.addJudge(newJudge)
      setJudges([...judges, createdJudge])
      setFormData({ name: '', role: 'D', assigned_events: [] })
      setShowForm(false)
    } catch (error) {
      console.error('Error creating judge:', error)
      alert('Error creating judge. Please try again.')
    }
  }
  
  if (loading) {
    return <div className="loading">Loading judges...</div>
  }
  
  return (
    <div className="judge-management">
      <div className="header">
        <h2>Judge Management</h2>
        <button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Add New Judge'}
        </button>
      </div>
      
      {showForm && (
        <form onSubmit={handleSubmit} className="add-judge card">
          <div className="card-header">
            <h2>Add New Judge</h2>
          </div>
          
          <div className="form-group">
            <label>Judge Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Judge Role:</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              required
            >
              <option value="D">D-Judge (Difficulty)</option>
              <option value="T">T-Judge (Technical)</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Assign to Events:</label>
            <div className="event-checkboxes">
              {events.map(event => (
                <div key={event.id} className="checkbox-item">
                  <input
                    type="checkbox"
                    id={`event-${event.id}`}
                    checked={formData.assigned_events.includes(event.id)}
                    onChange={() => handleEventAssignment(event.id)}
                  />
                  <label htmlFor={`event-${event.id}`}>{event.name}</label>
                </div>
              ))}
            </div>
          </div>
          
          <button type="submit">Add Judge</button>
        </form>
      )}
      
      <div className="judges-list card">
        <div className="card-header">
          <h2>Registered Judges</h2>
        </div>
        
        {judges.length === 0 ? (
          <p>No judges found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Role</th>
                <th>Assigned Events</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {judges.map(judge => (
                <tr key={judge.id}>
                  <td>{judge.id}</td>
                  <td>{judge.name}</td>
                  <td>{judge.role === 'D' ? 'D-Judge' : 'T-Judge'}</td>
                  <td>
                    {judge.assigned_events.length > 0 ? (
                      <ul>
                        {judge.assigned_events.map(eventId => {
                          const event = events.find(e => e.id === eventId)
                          return <li key={eventId}>{event ? event.name : `Event ${eventId}`}</li>
                        })}
                      </ul>
                    ) : (
                      <span>None</span>
                    )}
                  </td>
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

const AthleteManagement = () => {
  const [athletes, setAthletes] = useState([])
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    event_id: ''
  })
  
  useEffect(() => {
    const fetchAthletesAndEvents = async () => {
      try {
        const [athletesData, eventsData] = await Promise.all([
          googleSheetsService.getAthletes(),
          googleSheetsService.getEvents()
        ])
        
        setAthletes(athletesData)
        setEvents(eventsData)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching athletes and events:', error)
        setLoading(false)
      }
    }
    
    fetchAthletesAndEvents()
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
      const newAthlete = {
        ...formData,
        age: parseInt(formData.age),
        event_id: parseInt(formData.event_id)
      }
      
      const createdAthlete = await googleSheetsService.addAthlete(newAthlete)
      setAthletes([...athletes, createdAthlete])
      setFormData({ name: '', age: '', event_id: '' })
      setShowForm(false)
    } catch (error) {
      console.error('Error creating athlete:', error)
      alert('Error creating athlete. Please try again.')
    }
  }
  
  if (loading) {
    return <div className="loading">Loading athletes...</div>
  }
  
  return (
    <div className="athlete-management">
      <div className="header">
        <h2>Athlete Management</h2>
        <button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Register New Athlete'}
        </button>
      </div>
      
      {showForm && (
        <form onSubmit={handleSubmit} className="register-athlete card">
          <div className="card-header">
            <h2>Register New Athlete</h2>
          </div>
          
          <div className="form-group">
            <label>Athlete Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
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
              <option value="">Select Event</option>
              {events.map(event => (
                <option key={event.id} value={event.id}>
                  {event.name} ({event.category}, {event.age_group})
                </option>
              ))}
            </select>
          </div>
          
          <button type="submit">Register Athlete</button>
        </form>
      )}
      
      <div className="approved-athletes card">
        <div className="card-header">
          <h2>Registered Athletes</h2>
        </div>
        
        {athletes.length === 0 ? (
          <p>No athletes found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Registration No</th>
                <th>Name</th>
                <th>Age</th>
                <th>Event</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {athletes.map(athlete => {
                const event = events.find(e => e.id === athlete.event_id)
                return (
                  <tr key={athlete.id}>
                    <td>{athlete.id}</td>
                    <td>{athlete.registration_no}</td>
                    <td>{athlete.name}</td>
                    <td>{athlete.age}</td>
                    <td>{event ? event.name : 'Unknown Event'}</td>
                    <td>
                      <button className="secondary">Edit</button>
                      <button className="danger">Remove</button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

const ResultsDashboard = () => {
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
    return <div className="loading">Loading results...</div>
  }
  
  return (
    <div className="results-dashboard">
      <div className="card">
        <div className="card-header">
          <h2>Live Scoring Dashboard</h2>
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
          <div className="live-leaderboard">
            <h3>Top 10 Leaderboard</h3>
            {leaderboard.length === 0 ? (
              <p>No results available for this event.</p>
            ) : (
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
                  {leaderboard.map(entry => (
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
                  ))}
                </tbody>
              </table>
            )}
          </div>
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

const NotificationSystem = () => {
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'New athlete registration', message: 'Priya Sharma has registered for Intermediate Level I', time: '2 hours ago', read: false },
    { id: 2, title: 'Score submitted', message: 'Dr. Anil Kumar submitted scores for Priya Sharma', time: '1 day ago', read: true }
  ])
  
  const markAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ))
  }
  
  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
  }
  
  return (
    <div className="notification-system">
      <div className="card">
        <div className="card-header">
          <h2>Notifications</h2>
          <button className="secondary" onClick={markAllAsRead}>
            Mark All as Read
          </button>
        </div>
        
        <div className="notifications-list">
          {notifications.length === 0 ? (
            <p>No notifications</p>
          ) : (
            notifications.map(notification => (
              <div 
                key={notification.id} 
                className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                onClick={() => markAsRead(notification.id)}
              >
                <h4>{notification.title}</h4>
                <p>{notification.message}</p>
                <span className="time">{notification.time}</span>
              </div>
            ))
          )}
        </div>
      </div>
      
      <div className="send-notification card">
        <div className="card-header">
          <h2>Send Notification</h2>
        </div>
        
        <form>
          <div className="form-group">
            <label>Recipients:</label>
            <select>
              <option>All Athletes</option>
              <option>All Judges</option>
              <option>Specific Event Participants</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Subject:</label>
            <input type="text" placeholder="Notification subject" />
          </div>
          
          <div className="form-group">
            <label>Message:</label>
            <textarea placeholder="Notification message" rows="4"></textarea>
          </div>
          
          <button type="submit">Send Notification</button>
        </form>
      </div>
    </div>
  )
}

export default AdminPortal