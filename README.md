# Bhusurya Yoga Competition Management System

Bhusurya is a digital platform that automates yoga competition management, connecting Admins, Judges, and Athletes in a single ecosystem. It replaces manual paper-based processes with live Google Sheets backend for automated scoring, live leaderboards, and transparent results.

## 🌟 Key Features

### Admin Portal
- Create and manage events (category, age group, number of asanas)
- Assign D and T judges to events
- View live scoring dashboard with all judges' submissions
- Automatically calculate final scores
- Show Top 10 leaderboard
- Export results as CSV/PDF
- Send notifications to athletes/judges

### Athlete Portal
- Register for events (name, age, category, event)
- View assigned events and final score
- Access Top 10 leaderboard
- Download participation/result certificates

### D-Judge Portal (Difficulty Judges)
- View list of athletes and asanas per event
- Input marks per asana (0–10)
- Auto-scale total D marks to out of 8:
  - Formula: D = (Sum of Asana Marks / Total Possible Marks) × 8
- Submit scores, which update live in Google Sheets

### T-Judge Portal (Technical Judges)
- View athletes in assigned events
- Input technique/presentation scores (0–2)
- Submit scores, which update live in Google Sheets

## 🏗️ Scoring Logic

- **Total per judge** = D + T (out of 10)
- **For ≥3 judges:**
  - Drop highest and lowest judge totals
  - Sum remaining scores → Final score (do not divide)
  - Example: Scores = 9, 8, 9.5, 6, 7 → Remove 9.5 & 6 → Sum = 24/30
- **For <3 judges:**
  - Sum all scores directly
- Display final score and rank on Admin and Athlete portals
- Leaderboard auto-updates based on final scores

## 🗄️ Backend

- **Google Sheets:**
  - Store athletes, judges, events, and scores
  - Use formulas/scripts for auto-calculation of D, T, and final scores
  - Update leaderboard in real-time
- **Optional:** Google Apps Script for notifications & certificate generation

## 📊 Data Models

- **Events:** id, name, category, age_group, num_asanas, status, created_at, updated_at
- **Athletes:** id, name, age, event_id, registration_no
- **Judges:** id, name, role (D/T), assigned_events
- **AsanaScores (D Judge):** athlete_id, judge_id, asana_index, mark, timestamp
- **JudgeScores:** athlete_id, judge_id, d_score_out_of_8, t_score_out_of_2, judge_total_out_of_10
- **Results:** athlete_id, event_id, final_score, rank, dropped_highest, dropped_lowest

## 🎨 UI & UX Notes

- Responsive design for web and mobile
- Tooltips explaining scoring (D scaled to 8, T out of 2)
- Leaderboard shows sum after dropping highest & lowest
- Admin can lock scores after submission
- Color-coded leaderboard for top performers

## 🏗️ Tech Architecture

| Layer      | Technology                       | Purpose                                              |
| ---------- | -------------------------------- | ---------------------------------------------------- |
| Frontend   | React + Vite                     | Admin, Judge, Athlete portals                        |
| Backend    | Google Sheets + Apps Script      | Store scores, run formulas, live updates             |
| Hosting    | Vercel / Render (optional)       | Frontend live deployment                             |
| Automation | Google Sheets formulas / scripts | Auto-calculate totals, Top 10, remove highest/lowest |

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/srinivasthalada7781/mainyoga.git
   cd mainyoga/bhusurya
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

### Project Structure
```
src/
├── portals/
│   ├── admin/       # Admin Portal components
│   ├── athlete/     # Athlete Portal components
│   └── judge/       # Judge Portal components (D-Judge and T-Judge)
├── services/        # Google Sheets integration service
├── utils/           # Utility functions
├── assets/          # Static assets
└── components/      # Shared components
```

## 🎯 Usage

1. **Admin Portal** (`/admin`): Manage events, judges, athletes, and view live results
2. **Athlete Portal** (`/athlete`): Register for events, view scores, leaderboard, and certificates
3. **D-Judge Portal** (`/judge`): Enter difficulty scores for asanas
4. **T-Judge Portal** (`/tjudge`): Enter technical scores

## 📤 Google Sheets Integration

The system uses a mock Google Sheets service for demonstration purposes. In a production environment, this would connect to actual Google Sheets via:
- Google Sheets API for data reading/writing
- Google Apps Script for complex calculations
- Google Forms for judge score submissions

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

For support or queries, please contact the development team.