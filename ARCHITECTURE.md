# JARVIS Architecture & Design Patterns

JARVIS is built with a strictly decoupled, modular architecture adhering to the clean separation of UI components, application state, AI services, domain study engines, and hardware abstraction.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                             JARVIS WEB APP (UI)                             │
│  [Dashboard] [Chat] [Today's Plan] [Timetable] [Tasks] [Focus] [Quiz] etc. │
└───────────────────────┬───────────────────────────────┬─────────────────────┘
                        │                               │
            ┌───────────▼───────────┐       ┌───────────▼───────────┐
            │   Application State   │       │     AI Service        │
            │   (Store / Context)   │◄──────┤ (MockAIService + Tools│
            └───────────┬───────────┘       │  + Intent Recognition│
                        │                   └───────────────────────┘
     ┌──────────────────┼──────────────────┬─────────────────┐
     ▼                  ▼                  ▼                 ▼
[Study Engine]   [Schedule Engine]   [Task Engine]    [Timer Engine]
     │                  │                  │                 │
     └──────────────────┴─────────┬────────┴─────────────────┘
                                  │
                       ┌──────────▼──────────┐
                       │   HardwareService   │
                       └──────────┬──────────┘
                                  │
                       ┌──────────▼──────────┐
                       │  HardwareAdapter    │
                       │    (Interface)      │
                       └────┬───────────┬─────┘
                            │           │
              ┌─────────────▼───┐   ┌───▼──────────────┐
              │SimulatorAdapter │   │  ESP32Adapter    │
              │   (Active)      │   │ (Future Wi-Fi)   │
              └─────────────┬───┘   └──────────────────┘
                            │
               ┌────────────▼────────────┐
               │    Hardware Simulator   │
               │ • 128x64 OLED Display   │
               │ • 3-LED Indicator Glow  │
               │ • ESP32 Board Graphic   │
               └─────────────────────────┘
```

---

## 1. Domain Separation of Concerns

### A. UI Layer (`src/components/`, `src/pages/`)
- Pure presentation and user interaction components.
- Zero direct microcontroller, timer, or business calculation code embedded within UI elements.
- Consumes state and dispatches actions through the central `useJarvis()` hook.

### B. Application State (`src/state/JarvisContext.tsx`)
- Single source of truth containing:
  - `subjects`, `topics`, `schedule`, `tasks`, `exams`, `sessions`, `notes`, `settings`
  - `focusTimer` active Pomodoro state and timer heartbeat
  - `systemState` (`IDLE`, `LISTENING`, `THINKING`, `RESPONDING`, `STUDYING`, `PAUSED`, `COMPLETED`, `ERROR`, `OFFLINE`)
- Automatically broadcasts changes to `HardwareService` and persists data to `StorageService`.

### C. AI Cognition Layer (`src/services/ai/`)
- `AIService` interface with `MockAIService` implementation.
- `IntentParser` natural language engine for parsing study queries into actions.
- Tool Calling Engine executing typed application functions (`getCurrentTime`, `getTodaySchedule`, `getUpcomingExams`, `getTasks`, `createTask`, `startFocusSession`, `getStudyHistory`).

### D. Study Domain Engines (`src/services/study/`)
- `StudyEngine`: Weekly study analytics, streak computation, mastery scoring, weak area discovery, and exam-driven recommendations.
- `ScheduleEngine`: Sorting and grouping daily timelines into Morning, Afternoon, and Evening blocks.
- `TaskEngine`: Priority sorting (`URGENT` > `HIGH` > `MEDIUM` > `LOW`) and completion statistics.
- `TimerEngine`: Pure time formatting (`MM:SS`) and percentage calculation.

### E. Hardware Abstraction Layer (`src/services/hardware/`)
- `HardwareAdapter`: Universal contract for controlling OLED display frames and LED states.
- `SimulatorHardwareAdapter`: Real-time browser software simulator rendering 128x64 pixels.
- `ESP32HardwareAdapter`: Future Wi-Fi WebSocket/HTTP client.
- `HardwareService`: Singleton manager that coordinates the active adapter without requiring React component rewrites.

### F. Repository & Storage Layer (`src/services/storage/`)
- `StorageService`: Encapsulates local persistence (`localStorage`) behind a clean repository interface ready to swap with SQLite, PostgreSQL, or REST APIs.
