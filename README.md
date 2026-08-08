# JARVIS — Personal AI Study Assistant (Software-First Prototype)

**JARVIS** is a modern, modular software prototype for an intelligent personal study assistant. It is architected from the ground up to operate with a software-based **Hardware Simulator** that will seamlessly bridge to a physical **ESP32 microcontroller + 128x64 OLED + 3-LED status display** over Wi-Fi without rewriting the core application.

---

## ⚡ Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev

# 3. Run the automated test suite
npm test

# 4. Build production bundle
npm run build
```

The application runs locally on `http://localhost:5173`.

---

## 🌟 Core Features & Modules

### 1. 🎛️ Hardware Simulator (128x64 OLED & 3-LED Status)
- **Monochrome OLED Display:** Authentic 128x64 pixel matrix with CRT scanline rasterization, scalable pixel font, and high-contrast rendering.
- **Physical LED Indicators:**
  - 🔴 **Red (GPIO 25):** System Alert / Initializing / Standby
  - 🟡 **Yellow/Blue (GPIO 26):** AI Processing / Neural Cognition Pulse
  - 🟢 **Green (GPIO 27):** Active Study Mode / Pomodoro Focus
- **Interactive Controls:** RST/Reboot, AI Cognition Test, Quick 25M Study Trigger, Hardware Mode Toggle.

### 2. 🤖 Jarvis AI Conversational & Intent Engine
- Client-side `MockAIService` with natural language intent parser.
- Structured tool calling: `getCurrentTime()`, `getTodaySchedule()`, `getUpcomingExams()`, `getTasks()`, `createTask()`, `getStudyHistory()`, `createQuiz()`, `startFocusSession()`.
- Built-in academic derivations for **Physics (Gauss's Law, Mechanics)**, **Mathematics (Calculus, Limits)**, **Chemistry (Organic mechanisms)**, and **Computer Science (AVL Tree balancing)**.
- Optional Web Speech API text-to-speech voice synthesis.

### 3. ⏱️ Focus Session Engine (Pomodoro)
- Configurable study intervals (25m, 45m, 50m, 60m, or custom duration).
- Direct real-time hardware synchronization (switches simulated OLED to **STUDY MODE** with live timer countdown and activates the **Green LED**).
- Records completed sessions into history and study analytics.

### 4. 📅 Today's Plan & Timetable
- Categorized timeline blocks (**Morning**, **Afternoon**, **Evening**).
- Status lifecycle: `UPCOMING` ➔ `CURRENT` ➔ `COMPLETED` / `SKIPPED`.
- Day / Week views with multi-subject filtering and schedule item creation.

### 5. 📝 Tasks & Homework Engine
- Priority weighting: `URGENT` > `HIGH` > `MEDIUM` > `LOW`.
- Status tracking (`TODO`, `IN_PROGRESS`, `COMPLETED`), search bar, and due-date filters.

### 6. 🧠 Active Recall Quiz Mode
- Interactive multiple-choice study assessments.
- Real-time scoring, accuracy computation, weak area diagnosis, and recommended revision topics.

### 7. 📊 Study Analytics & Progress
- Weekly study distribution charts, subject breakdown percentages, strong/weak topic matrix, and AI exam recommendations.

### 8. 🎙️ Daily Briefing Directive
- One-click daily briefing summary with audio speech readout.

---

## 🏛️ Project Structure

```
c:/projects/jarvis/
├── src/
│   ├── components/
│   │   ├── briefing/          # DailyBriefingModal
│   │   ├── chat/              # ChatDrawer, Chat messages
│   │   ├── common/            # Navbar, Sidebar, StatusBadge
│   │   └── hardware/          # HardwareSimulator, OLEDCanvas, LEDIndicator
│   ├── pages/
│   │   ├── DashboardPage.tsx  # Hero overview, timetable preview, exam alert
│   │   ├── TodayPlanPage.tsx  # Morning/Afternoon/Evening study blocks
│   │   ├── TimetablePage.tsx  # Full multi-subject schedule grid
│   │   ├── TasksPage.tsx      # Task board with priority sorting
│   │   ├── FocusPage.tsx      # Pomodoro focus timer with hardware sync
│   │   ├── QuizPage.tsx       # MCQ active recall & diagnostics
│   │   ├── NotesPage.tsx      # Markdown note editor & repository
│   │   ├── ProgressPage.tsx   # Visual study metrics & mastery tracking
│   │   └── SettingsPage.tsx   # Identity, themes, durations, hardware modes
│   ├── services/
│   │   ├── ai/                # MockAIService, IntentParser, VoiceService
│   │   ├── hardware/          # HardwareAdapter, SimulatorAdapter, ESP32Adapter
│   │   ├── storage/           # StorageService (Repository pattern)
│   │   └── study/             # StudyEngine, ScheduleEngine, TaskEngine, TimerEngine
│   ├── state/
│   │   ├── JarvisContext.tsx  # Central Application State & Timer Heartbeat
│   │   └── initialData.ts     # Demo subjects (Physics, Math, Chem, CS)
│   ├── types/                 # Strict TypeScript domain interfaces
│   ├── App.tsx                # App Shell & Navigation Router
│   ├── index.css              # Glassmorphism, OLED styles & design system
│   └── main.tsx               # App bootstrap
├── tests/                     # Unit test suites (Schedule, Tasks, Timer, AI, OLED)
├── ARCHITECTURE.md            # Modular architecture deep dive
├── HARDWARE_INTEGRATION.md    # Future ESP32 Wi-Fi JSON protocol & pinout
├── AI_TOOLS.md                # AI Tool call definitions and schema
└── DEVELOPMENT_ROADMAP.md     # Phase-by-phase physical migration guide
```
