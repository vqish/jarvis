# JARVIS AI Tools & Function Calling Reference

JARVIS features a pluggable tool execution architecture modeled after modern LLM function calling (OpenAI Functions / Gemini Function Calling).

---

## 1. Tool Call Architecture

```
User Prompt ("What should I study now?")
                  │
                  ▼
          IntentParser.parse()
                  │
                  ▼
         MockAIService Loop
                  │
  ┌───────────────┴───────────────┐
  ▼                               ▼
Tool 1: getTodaySchedule()     Tool 2: getUpcomingExams()
  │                               │
  └───────────────┬───────────────┘
                  ▼
         Synthesized Response
                  │
                  ▼
    Hardware State Synchronization
```

---

## 2. Registered Study Tools

### 1. `getCurrentTime()`
- **Purpose:** Returns the current local time, weekday, and date.
- **Parameters:** None
- **Sample Output:** `{ "time": "10:30 AM", "date": "Friday, Aug 8, 2026" }`

### 2. `getTodaySchedule()`
- **Purpose:** Fetches all scheduled study blocks, timeline slots, and statuses for the day.
- **Parameters:** None
- **Sample Output:**
```json
[
  { "time": "09:00 - 10:00", "title": "Differential Calculus Review", "status": "COMPLETED" },
  { "time": "10:30 - 11:15", "title": "Electrostatics Deep Dive", "status": "UPCOMING", "priority": "URGENT" }
]
```

### 3. `getUpcomingExams()`
- **Purpose:** Retrieves examination deadlines, days remaining, and target score thresholds.
- **Parameters:** None
- **Sample Output:**
```json
[
  { "title": "Physics Midterm: Electrostatics & Magnetism", "daysRemaining": 6, "targetScore": "92%" }
]
```

### 4. `getTasks(filter)`
- **Purpose:** Retrieves pending homework, problem sets, and proof exercises.
- **Parameters:** `{ "filter": "TODO | ALL" }`

### 5. `createTask(title, subjectId, priority, dueDate)`
- **Purpose:** Instantly creates a study task in the application state.
- **Parameters:** `{ "title": "string", "subjectId": "string", "priority": "LOW | MEDIUM | HIGH | URGENT" }`

### 6. `startFocusSession(duration, subject, topic)`
- **Purpose:** Initiates a Pomodoro focus timer, updates the hardware simulator OLED to `STUDY MODE`, and turns on the Green LED.
- **Parameters:** `{ "duration": 45, "subject": "Physics", "topic": "Electrostatics & Coulomb Law" }`

### 7. `getStudyHistory()`
- **Purpose:** Retrieves logged focus hours, completed sessions, and weekly subject distribution.
- **Parameters:** None

### 8. `createQuiz(subjectId, topicName)`
- **Purpose:** Prepares an active recall multiple-choice test for concept evaluation.
- **Parameters:** `{ "subjectId": "sub-phys" }`

---

## 3. Migration to Real LLM APIs (OpenAI / Gemini)

To swap `MockAIService` with `GeminiService` or `OpenAIService`:
1. Implement the `AIService` interface (`src/services/ai/types.ts`).
2. Pass the JSON schema definitions of the tools above in the API payload.
3. When the LLM returns `tool_calls`, execute the registered tool handler and return the result in the follow-up turn.
