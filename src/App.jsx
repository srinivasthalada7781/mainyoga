import { useState } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import './App.css'

// Portal Components
import AdminPortal from './portals/admin/AdminPortal'
import AthletePortal from './portals/athlete/AthletePortal'
import JudgePortal from './portals/judge/JudgePortal'
import TJudgePortal from './portals/judge/TJudgePortal'

function App() {
  const location = useLocation()
  
  const getNavLinkClass = (path) => {
    return location.pathname === path ? 'active' : ''
  }
  
  return (
    <div className="app">
      <nav className="navigation">
        <ul>
          <li><Link to="/" className={getNavLinkClass('/')}>Home</Link></li>
          <li><Link to="/admin" className={getNavLinkClass('/admin')}>Admin Portal</Link></li>
          <li><Link to="/athlete" className={getNavLinkClass('/athlete')}>Athlete Portal</Link></li>
          <li><Link to="/judge" className={getNavLinkClass('/judge')}>D-Judge Portal</Link></li>
          <li><Link to="/tjudge" className={getNavLinkClass('/tjudge')}>T-Judge Portal</Link></li>
        </ul>
      </nav>

      <Routes>
        <Route path="/admin/*" element={<AdminPortal />} />
        <Route path="/athlete/*" element={<AthletePortal />} />
        <Route path="/judge/*" element={<JudgePortal />} />
        <Route path="/tjudge/*" element={<TJudgePortal />} />
        <Route path="/" element={
          <div className="home">
            <h1>Bhusurya Yoga Competition Management System</h1>
            <p>A digital platform that automates yoga competition management, connecting Admins, Judges, and Athletes in a single ecosystem. Replaces manual paper-based processes with live Google Sheets backend for automated scoring, live leaderboards, and transparent results.</p>
            
            <div className="portal-links">
              <Link to="/admin" className="portal-link admin">
                <div>
                  <h2>Admin Portal</h2>
                  <p>Manage events, judges, athletes and view live results</p>
                </div>
              </Link>
              
              <Link to="/athlete" className="portal-link athlete">
                <div>
                  <h2>Athlete Portal</h2>
                  <p>Register for events and view scores/certificates</p>
                </div>
              </Link>
              
              <Link to="/judge" className="portal-link judge">
                <div>
                  <h2>D-Judge Portal</h2>
                  <p>Enter difficulty scores for asanas (0-10)</p>
                </div>
              </Link>
              
              <Link to="/tjudge" className="portal-link judge">
                <div>
                  <h2>T-Judge Portal</h2>
                  <p>Enter technical scores (0-2)</p>
                </div>
              </Link>
            </div>
            
            <div className="features">
              <h2>Key Features</h2>
              <div className="grid grid-cols-3">
                <div className="card">
                  <h3>Automated Scoring</h3>
                  <p>Eliminates calculation errors with automatic score computation</p>
                </div>
                <div className="card">
                  <h3>Live Leaderboards</h3>
                  <p>Real-time updates as judges submit scores</p>
                </div>
                <div className="card">
                  <h3>Google Sheets Backend</h3>
                  <p>All data stored in Google Sheets for easy auditing</p>
                </div>
              </div>
            </div>
          </div>
        } />
      </Routes>
    </div>
  )
}

export default App