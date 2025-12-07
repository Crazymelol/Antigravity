# ⚔️ Antigravity - Fencing Club Management Platform

A comprehensive web application for managing fencing clubs, athletes, competitions, and training programs. Built with React, Vite, and Tailwind CSS.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

### 🏅 Core Management
- **Athlete Management** - Complete athlete profiles with performance tracking
- **Competition Scheduling** - Tournament calendar with AskFRED-style details
- **Attendance Tracking** - Daily check-in system with history
- **Dashboard** - Real-time overview of club activities

### 👨‍👩‍👧 Multi-Role Access
- **Coach Portal** - Full administrative access
- **Athlete Portal** - Personal performance and schedule view
- **Parent Portal** - Monitor child's progress and attendance
- **Admin Dashboard** - Approve/manage coach accounts

### 🏆 Tournament Operations
- **Referee Management** - Database with certification levels (Regional/National/FIE)
- **Badge Generator** - Printable QR-coded accreditation badges
- **Live Strip View** - Real-time bout monitoring with auto-refresh

### 🏢 Club Management
- **Inventory Tracking** - Equipment management with assignment system
- **Lesson Booking** - Private lesson scheduling with calendar view
- **Wellness Monitoring** - Track athlete fatigue, sleep, and recovery
- **Workload Management** - RPE-based training load tracking

### 📱 Digital Experience
- **QR Check-In** - Contactless attendance with visual QR codes
- **Smart Schedule** - Personalized athlete timelines
- **Performance Charts** - Radar and line charts for athlete analytics
- **Announcements** - Club-wide communication system

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Modern web browser

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/antigravity.git
cd antigravity

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` to view the app.

### Login Options
- **Coach**: Select "Head Coach" from the dropdown
- **Athlete**: Choose any athlete from the list
- **Parent**: Select a parent account
- **Admin**: Click "Admin Login" (for coach approval)

## 📦 Build & Deploy

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

See deployment guide in artifacts for detailed instructions.

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite 7
- **Styling**: Tailwind CSS v4
- **Routing**: React Router v7
- **Icons**: Lucide React
- **Charts**: Recharts
- **State**: React Context API
- **Storage**: localStorage (client-side)

## 📁 Project Structure

```
antigravity/
├── src/
│   ├── components/        # React components
│   ├── context/          # State management
│   ├── data/             # Seed data
│   ├── utils/            # Utilities
│   ├── App.jsx           # Main app component
│   └── main.jsx          # Entry point
├── public/               # Static assets
├── vercel.json           # Vercel configuration
└── package.json
```

## 🔒 Security Note

Current version uses **mock authentication** for demonstration purposes. For production deployment:
- Implement real authentication (Supabase Auth, Firebase Auth)
- Add backend API for data persistence
- Enable role-based access control
- Use HTTPS for all connections

## 📝 License

MIT License

---

**Built with ⚔️ by the Antigravity team**
