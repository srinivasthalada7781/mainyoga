// Mock Google Sheets Service for Bhusurya Yoga Competition System
// In a real implementation, this would connect to actual Google Sheets API

class GoogleSheetsService {
  constructor() {
    // Mock data to simulate Google Sheets
    this.athletes = [
      { id: 1, name: 'Priya Sharma', age: 22, category: 'Intermediate', events: ['Intermediate Level I'] },
      { id: 2, name: 'Rahul Mehta', age: 14, category: 'Beginner', events: ['Beginner Level I'] },
      { id: 3, name: 'Sneha Patel', age: 30, category: 'Senior', events: ['Senior Level I'] }
    ]
    
    this.events = [
      { id: 1, name: 'Beginner Level I', category: 'Beginner', ageGroup: '10-15', asanas: 5 },
      { id: 2, name: 'Intermediate Level I', category: 'Intermediate', ageGroup: '16-25', asanas: 7 },
      { id: 3, name: 'Senior Level I', category: 'Senior', ageGroup: '26-40', asanas: 8 }
    ]
    
    this.judges = [
      { id: 1, name: 'Dr. Anil Kumar', type: 'D-Judge', assignedEvents: ['Beginner Level I'] },
      { id: 2, name: 'Sunita Rao', type: 'T-Judge', assignedEvents: ['Beginner Level I', 'Intermediate Level I'] },
      { id: 3, name: 'Prof. Ramesh Patel', type: 'D-Judge', assignedEvents: ['Senior Level I'] }
    ]
    
    this.scores = [
      { 
        athleteId: 1, 
        eventId: 2, 
        judgeId: 1, 
        type: 'D-Score', 
        value: 7.2,
        asanaScores: [8, 7, 9, 7, 8, 7, 8]
      },
      { 
        athleteId: 1, 
        eventId: 2, 
        judgeId: 2, 
        type: 'T-Score', 
        value: 1.8 
      }
    ]
  }
  
  // Athlete methods
  getAthletes() {
    return Promise.resolve(this.athletes)
  }
  
  getAthleteById(id) {
    const athlete = this.athletes.find(a => a.id === id)
    return Promise.resolve(athlete)
  }
  
  addAthlete(athlete) {
    const newId = Math.max(...this.athletes.map(a => a.id)) + 1
    const newAthlete = { ...athlete, id: newId }
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
    const newEvent = { ...event, id: newId }
    this.events.push(newEvent)
    return Promise.resolve(newEvent)
  }
  
  updateEvent(id, updatedEvent) {
    const index = this.events.findIndex(e => e.id === id)
    if (index !== -1) {
      this.events[index] = { ...this.events[index], ...updatedEvent }
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
  
  // Judge methods
  getJudges() {
    return Promise.resolve(this.judges)
  }
  
  getJudgeById(id) {
    const judge = this.judges.find(j => j.id === id)
    return Promise.resolve(judge)
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
  
  // Score methods
  getScores() {
    return Promise.resolve(this.scores)
  }
  
  getScoresByEventId(eventId) {
    const eventScores = this.scores.filter(s => s.eventId === eventId)
    return Promise.resolve(eventScores)
  }
  
  getScoresByAthleteId(athleteId) {
    const athleteScores = this.scores.filter(s => s.athleteId === athleteId)
    return Promise.resolve(athleteScores)
  }
  
  addScore(score) {
    this.scores.push(score)
    return Promise.resolve(score)
  }
  
  // Calculate final score by removing highest and lowest scores
  calculateFinalScore(scores) {
    if (scores.length < 3) {
      return scores.reduce((sum, score) => sum + score.value, 0)
    }
    
    // Sort scores and remove highest and lowest
    const sortedScores = [...scores].sort((a, b) => a.value - b.value)
    const trimmedScores = sortedScores.slice(1, -1)
    
    // Sum the remaining scores
    return trimmedScores.reduce((sum, score) => sum + score.value, 0)
  }
  
  // Get leaderboard for an event
  getLeaderboard(eventId) {
    // This would be implemented to calculate the leaderboard based on scores
    // For now, returning mock data
    return Promise.resolve([
      { rank: 1, athleteId: 1, athleteName: 'Priya Sharma', finalScore: 9.0 },
      { rank: 2, athleteId: 2, athleteName: 'Ravi Kumar', finalScore: 8.5 },
      { rank: 3, athleteId: 3, athleteName: 'Sneha Patel', finalScore: 8.4 }
    ])
  }
}

// Export a singleton instance
const googleSheetsService = new GoogleSheetsService()
export default googleSheetsService