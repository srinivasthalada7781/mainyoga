# Bhusurya Yoga Competition Management System

Bhusurya is a digital platform that automates yoga competition management, connecting Admins, Judges, and Athletes in a single ecosystem. It replaces manual paper-based processes with live Google Sheets backend for automated scoring, live leaderboards, and transparent results.

## 🌟 Key Features

### 1. Admin Portal
- Create and manage events (category, age group, number of asanas)
- Add judges (D and T judges) and assign them to events
- Approve athlete registrations
- Live scoring dashboard with automatic updates
- Auto-calculation of Top 10 athletes
- Export results (CSV/PDF)
- Send notifications to athletes or judges

### 2. Athlete Portal
- Register for events (auto-categorized by age and event type)
- View assigned events
- See final scores and ranking after judge submissions
- Download participation/result certificates
- Track progress over multiple events

### 3. Judge Portal
#### D Judges (Difficulty Judges)
- Enter marks for each asana (out of 10)
- System auto-calculates total D score scaled to 8
- Formula: `D = (Sum of Asana Marks / Total Possible Marks) × 8`

#### T Judges (Technical Judges)
- Enter overall performance score (out of 2)
- Judge Total = D + T (out of 10)

### 4. Final Score Calculation
- System removes highest and lowest scores from all judges
- Sums remaining scores for final result
- Example: Scores 9, 8, 9.5, 6, 7 → Remove 9.5 & 6 → Sum 9 + 8 + 7 = 24 (out of 30)

### 5. Live Backend with Google Sheets
- All data stored in Google Sheets
- Each judge's submission updates their sheet via Forms or API integration
- Admin dashboard reads sheet live for:
  - Scores per athlete per judge
  - Final scores (after removing highest/lowest)
  - Top 10 leaderboard
- Athletes' portal also reads sheet live for instant score updates

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
   git clone <repository-url>
   cd bhusurya
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
│   └── judge/       # Judge Portal components
├── services/        # Google Sheets integration service
├── utils/           # Utility functions
├── assets/          # Static assets
└── components/      # Shared components
```

## 🎯 Usage

1. **Admin Portal** (`/admin`): Manage events, judges, athletes, and view live results
2. **Athlete Portal** (`/athlete`): Register for events and view scores/certificates
3. **Judge Portal** (`/judge`): Enter scores for assigned events

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