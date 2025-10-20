// Google Sheets Service for Bhusurya Yoga Competition System
// This service simulates Google Sheets backend functionality

class GoogleSheetsService {
  constructor() {
    // Data models based on requirements
    this.events = [
      { 
        id: 1, 
        name: 'Beginner Level I', 
        category: 'Beginner', 
        age_group: '10-15', 
        num_asanas: 5, 
        status: 'active', 
        created_at: '2025-10-01', 
        updated_at: '2025-10-01' 
      },
      { 
        id: 2, 
        name: 'Intermediate Level I', 
        category: 'Intermediate', 
        age_group: '16-25', 
        num_asanas: 7, 
        status: 'active', 
        created_at: '2025-10-01', 
        updated_at: '2025-10-01' 
      },
      { 
        id: 3, 
        name: 'Senior Level I', 
        category: 'Senior', 
        age_group: '26-40', 
        num_asanas: 8, 
        status: 'upcoming', 
        created_at: '2025-10-01', 
        updated_at: '2025-10-01' 
      }
    ]
    
    this.athletes = [
      { 
        id: 1, 
        name: 'Priya Sharma', 
        age: 22, 
        event_id: 2, 
        registration_no: 'ATH001' 
      },
      { 
        id: 2, 
        name: 'Rahul Mehta', 
        age: 14, 
        event_id: 1, 
        registration_no: 'ATH002' 
      },
      { 
        id: 3, 
        name: 'Sneha Patel', 
        age: 30, 
        event_id: 3, 
        registration_no: 'ATH003' 
      }
    ]
    
    this.judges = [
      { 
        id: 1, 
        name: 'Dr. Anil Kumar', 
        role: 'D', 
        assigned_events: [1, 2] 
      },
      { 
        id: 2, 
        name: 'Sunita Rao', 
        role: 'T', 
        assigned_events: [1, 2] 
      },
      { 
        id: 3, 
        name: 'Prof. Ramesh Patel', 
        role: 'D', 
        assigned_events: [3] 
      }
    ]
    
    this.asanaScores = [
      { 
        athlete_id: 1, 
        judge_id: 1, 
        asana_index: 1, 
        mark: 8, 
        timestamp: '2025-10-15T10:30:00Z' 
      },
      { 
        athlete_id: 1, 
        judge_id: 1, 
        asana_index: 2, 
        mark: 7, 
        timestamp: '2025-10-15T10:32:00Z' 
      }
    ]
    
    this.judgeScores = [
      { 
        athlete_id: 1, 
        judge_id: 1, 
        d_score_out_of_8: 7.2, 
        t_score_out_of_2: null, 
        judge_total_out_of_10: 7.2 
      },
      { 
        athlete_id: 1, 
        judge_id: 2, 
        d_score_out_of_8: null, 
        t_score_out_of_2: 1.8, 
        judge_total_out_of_10: 1.8 
      }
    ]
    
    this.results = [
      { 
        athlete_id: 1, 
        event_id: 2, 
        final_score: 9.0, 
        rank: 1, 
        dropped_highest: false, 
        dropped_lowest: false 
      }
    ]
  }
  
  // Event methods
  getEvents() {
    return Promise.resolve(this.events)
  }
  
  getEventById(id) {
    const event = this.events.find(e => e.id === id)
    return Promise.resolve(event)
  }
  
  addEvent(event) {
    const newId = Math.max(...this.events.map(e => e.id)) + 1
    const newEvent = { 
      ...event, 
      id: newId, 
      status: 'active',
      created_at: new Date().toISOString().split('T')[0],
      updated_at: new Date().toISOString().split('T')[0]
    }
    this.events.push(newEvent)
    return Promise.resolve(newEvent)
  }
  
  updateEvent(id, updatedEvent) {
    const index = this.events.findIndex(e => e.id === id)
    if (index !== -1) {
      this.events[index] = { 
        ...this.events[index], 
        ...updatedEvent,
        updated_at: new Date().toISOString().split('T')[0]
      }
      return Promise.resolve(this.events[index])
    }
    return Promise.reject(new Error('Event not found'))
  }
  
  deleteEvent(id) {
    const index = this.events.findIndex(e => e.id === id)
    if (index !== -1) {
      this.events.splice(index, 1)
      return Promise.resolve(true)
    }
    return Promise.reject(new Error('Event not found'))
  }
  
  // Athlete methods
  getAthletes() {
    return Promise.resolve(this.athletes)
  }
  
  getAthleteById(id) {
    const athlete = this.athletes.find(a => a.id === id)
    return Promise.resolve(athlete)
  }
  
  getAthletesByEventId(eventId) {
    const athletes = this.athletes.filter(a => a.event_id === eventId)
    return Promise.resolve(athletes)
  }
  
  addAthlete(athlete) {
    const newId = Math.max(...this.athletes.map(a => a.id)) + 1
    const regNumber = `ATH${String(newId).padStart(3, '0')}`
    const newAthlete = { ...athlete, id: newId, registration_no: regNumber }
    this.athletes.push(newAthlete)
    return Promise.resolve(newAthlete)
  }
  
  updateAthlete(id, updatedAthlete) {
    const index = this.athletes.findIndex(a => a.id === id)
    if (index !== -1) {
      this.athletes[index] = { ...this.athletes[index], ...updatedAthlete }
      return Promise.resolve(this.athletes[index])
    }
    return Promise.reject(new Error('Athlete not found'))
  }
  
  deleteAthlete(id) {
    const index = this.athletes.findIndex(a => a.id === id)
    if (index !== -1) {
      this.athletes.splice(index, 1)
      return Promise.resolve(true)
    }
    return Promise.reject(new Error('Athlete not found'))
  }
  
  // Judge methods
  getJudges() {
    return Promise.resolve(this.judges)
  }
  
  getJudgeById(id) {
    const judge = this.judges.find(j => j.id === id)
    return Promise.resolve(judge)
  }
  
  getJudgesByEventId(eventId) {
    const judges = this.judges.filter(j => j.assigned_events.includes(eventId))
    return Promise.resolve(judges)
  }
  
  getDJsByEventId(eventId) {
    const judges = this.judges.filter(j => j.role === 'D' && j.assigned_events.includes(eventId))
    return Promise.resolve(judges)
  }
  
  getTJsByEventId(eventId) {
    const judges = this.judges.filter(j => j.role === 'T' && j.assigned_events.includes(eventId))
    return Promise.resolve(judges)
  }
  
  addJudge(judge) {
    const newId = Math.max(...this.judges.map(j => j.id)) + 1
    const newJudge = { ...judge, id: newId }
    this.judges.push(newJudge)
    return Promise.resolve(newJudge)
  }
  
  updateJudge(id, updatedJudge) {
    const index = this.judges.findIndex(j => j.id === id)
    if (index !== -1) {
      this.judges[index] = { ...this.judges[index], ...updatedJudge }
      return Promise.resolve(this.judges[index])
    }
    return Promise.reject(new Error('Judge not found'))
  }
  
  deleteJudge(id) {
    const index = this.judges.findIndex(j => j.id === id)
    if (index !== -1) {
      this.judges.splice(index, 1)
      return Promise.resolve(true)
    }
    return Promise.reject(new Error('Judge not found'))
  }
  
  // Asana Scores methods
  getAsanaScores() {
    return Promise.resolve(this.asanaScores)
  }
  
  getAsanaScoresByAthleteAndJudge(athleteId, judgeId) {
    const scores = this.asanaScores.filter(s => s.athlete_id === athleteId && s.judge_id === judgeId)
    return Promise.resolve(scores)
  }
  
  addAsanaScore(score) {
    this.asanaScores.push(score)
    return Promise.resolve(score)
  }
  
  // Judge Scores methods
  getJudgeScores() {
    return Promise.resolve(this.judgeScores)
  }
  
  getJudgeScoresByAthlete(athleteId) {
    const scores = this.judgeScores.filter(s => s.athlete_id === athleteId)
    return Promise.resolve(scores)
  }
  
  getJudgeScoresByEvent(eventId) {
    // First get athletes in the event
    const eventAthletes = this.athletes.filter(a => a.event_id === eventId)
    const athleteIds = eventAthletes.map(a => a.id)
    
    // Then get scores for those athletes
    const scores = this.judgeScores.filter(s => athleteIds.includes(s.athlete_id))
    return Promise.resolve(scores)
  }
  
  addJudgeScore(score) {
    this.judgeScores.push(score)
    return Promise.resolve(score)
  }
  
  // Results methods
  getResults() {
    return Promise.resolve(this.results)
  }
  
  getResultsByEvent(eventId) {
    const results = this.results.filter(r => r.event_id === eventId)
    return Promise.resolve(results)
  }
  
  getResultsByAthlete(athleteId) {
    const results = this.results.filter(r => r.athlete_id === athleteId)
    return Promise.resolve(results)
  }
  
  addResult(result) {
    this.results.push(result)
    return Promise.resolve(result)
  }
  
  // Scoring logic
  calculateDScore(asanaMarks, totalAsanas) {
    if (asanaMarks.length === 0) return 0
    
    const sum = asanaMarks.reduce((acc, mark) => acc + mark, 0)
    const maxPossible = totalAsanas * 10
    return (sum / maxPossible) * 8
  }
  
  calculateFinalScore(judgeScores) {
    if (judgeScores.length < 3) {
      // For <3 judges: Sum all scores directly
      return judgeScores.reduce((sum, score) => sum + score.judge_total_out_of_10, 0)
    } else {
      // For ≥3 judges: Drop highest and lowest judge totals, sum remaining
      const totals = judgeScores.map(s => s.judge_total_out_of_10)
      const sortedTotals = [...totals].sort((a, b) => a - b)
      
      // Remove highest and lowest
      sortedTotals.pop() // Remove highest
      sortedTotals.shift() // Remove lowest
      
      // Sum remaining scores
      return sortedTotals.reduce((sum, total) => sum + total, 0)
    }
  }
  
  // Get leaderboard for an event
  getLeaderboard(eventId) {
    // Get athletes in the event
    const eventAthletes = this.athletes.filter(a => a.event_id === eventId)
    
    // Calculate final scores for each athlete
    const leaderboard = eventAthletes.map(athlete => {
      const athleteScores = this.judgeScores.filter(s => s.athlete_id === athlete.id)
      const finalScore = this.calculateFinalScore(athleteScores)
      
      return {
        athlete_id: athlete.id,
        athlete_name: athlete.name,
        registration_no: athlete.registration_no,
        final_score: finalScore
      }
    })
    
    // Sort by final score (descending)
    leaderboard.sort((a, b) => b.final_score - a.final_score)
    
    // Add ranks
    leaderboard.forEach((entry, index) => {
      entry.rank = index + 1
    })
    
    return Promise.resolve(leaderboard)
  }
}

// Export a singleton instance
const googleSheetsService = new GoogleSheetsService()
export default googleSheetsService