# 📊 Student AI Analytics System

### *Bridging the "Transparency Gap" in GenAI-Driven Higher Education*

[![React](https://img.shields.io/badge/Frontend-React%2019-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![MySQL](https://img.shields.io/badge/Database-MySQL-4479A1?logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Vite](https://img.shields.io/badge/Build-Vite-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)

---

## 🚀 Overview

The **Student AI Analytics System** is a production-ready, high-end analytics suite designed to monitor and predict the impact of Generative AI (GenAI) on student performance. In an era where AI usage is ubiquitous, this platform transforms raw data into actionable intelligence, helping institutions move from "guessing" to student-centric intervention.

### ⚠️ The Problem: The Academic "Black Box"
Academic institutions face a systemic crisis:
- **The Crutch Effect:** Difficulty in distinguishing AI as a learning accelerant vs. a substitute for critical thinking.
- **Delayed Intervention:** Traditional tracking identifies failure after it happens, not the "at-risk" trends.
- **Well-being Anomalies:** Lack of data correlating AI dependency with student stress and falling digital literacy.

---

## ✨ Key Features

### 🔍 Predictive Risk Modeling
Powered by a **Logistic Regression Engine**, the system calculates a 0-100% "Risk Score" for every student, flagging vulnerabilities weeks before exams by analyzing AI usage hours vs. academic performance.

### 📉 AI Efficiency Scoring
Custom-built metric: `(CGPA / AI_Hours) * Factor`. This exposes the "Smart Workers" (using AI as a tool) vs. "AI Dependents" (using AI as a replacement).

### ⚡ Real-Time Filter Pipeline
A high-performance dynamic query system allowing administrative staff to filter through thousands of records across geographies, streams, and demographics in milliseconds.

### 📱 Telegram Alert System
Direct integration with the Telegram API. Critical failures or high-risk flags trigger immediate, secure mobile notifications to system administrators.

### 📑 Multi-Format Export Engine
Generate live reports directly from the dashboard in **PDF**, **CSV**, **JSON**, and **DOCX** formats.

### 🖼️ Premium UI/UX
Features a cutting-edge **Glassmorphism** design with backdrop-filter effects, ambient background animations, and interactive data visualizations using **Recharts**.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 19 (Vite)
- **Styling:** Vanilla CSS (Glassmorphism design)
- **Charts:** Recharts
- **Icons:** Lucide-React
- **State Management:** React Router DOM (v7)

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Authentication:** JWT, BcryptJS
- **Notifications:** Telegram Bot API
- **File Generation:** PDFKit, Docx

### Database
- **Engine:** MySQL (Relational integrity for complex joining of student streams/IDs)
- **Library:** `mysql2` (Promise-based)

### Integration
- **BI Tools:** Embedded Tableau dashboards for deep-dive geographic heatmaps.

---

## 📂 Project Structure

```text
AI_Usage_Analytics/
├── backend/            # Express.js Server & API Routes
│   ├── config/         # Database configurations
│   ├── routes/         # API Endpoint definitions
│   ├── middleware/     # Auth & Error handling
│   └── server.js       # Main entry point
├── frontend/           # React 19 + Vite UI
│   ├── src/            # Components, Hooks, & Pages
│   ├── public/         # Assets & Videos
│   └── vite.config.js  # Build config
└── database/           # SQL schemas and setup scripts
```

---

## ⚙️ Installation & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [MySQL](https://www.mysql.com/)

### 1. Database Setup
Create a MySQL database and run the provided schema scripts in the `/database` folder.

### 2. Backend Configuration
Navigate to the `backend` folder and create a `.env` file:
```env
PORT=5000
DB_HOST=localhost
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=student_ai_db
JWT_SECRET=your_jwt_secret
TELEGRAM_BOT_TOKEN=your_token
TELEGRAM_CHAT_ID=your_id
```

### 3. Run the Project

**Start Backend:**
```bash
cd backend
npm install
npm start
```

**Start Frontend:**
```bash
cd frontend
npm install
npm run dev
```

---

## 📈 Impact
This system bridges the gap between raw data and actionable intelligence, providing a **Single Point of Truth (SPOT)** for monitoring the AI revolution and ensuring academic integrity is maintained.

---

## 📄 License
This project is licensed under the ISC License.

---
*Created by [Your Name/GitHub Handle]*
