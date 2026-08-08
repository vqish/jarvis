# JARVIS Firestore Data Architecture

This document describes the tenant-isolated, per-user data hierarchy designed for the JARVIS Personal AI Study Assistant backend on Cloud Firestore.

---

## 1. Top-Level Hierarchy & Isolation Principle

To guarantee strict security, user privacy, and zero data leakage across different students, **all study data is partitioned under `users/{userId}`**.

```
firestore-root/
  └── users/
        └── {userId}/                           <-- User Profile Document
              ├── subjects/                      <-- Subcollection: Enrolled subjects
              │     └── {subjectId}
              ├── tasks/                         <-- Subcollection: Problem sets & homework
              │     └── {taskId}
              ├── schedule/                      <-- Subcollection: Daily timetable blocks
              │     └── {scheduleId}
              ├── studySessions/                 <-- Subcollection: Focus Pomodoro logs
              │     └── {sessionId}
              ├── notes/                         <-- Subcollection: Markdown cheat sheets
              │     └── {noteId}
              ├── quizResults/                   <-- Subcollection: Active recall diagnostics
              │     └── {resultId}
              ├── exams/                         <-- Subcollection: Midterm & final milestones
              │     └── {examId}
              └── settings/                      <-- Subcollection: User preferences
                    └── user_settings
```

---

## 2. Document Schemas

### A. User Profile: `users/{userId}`
```json
{
  "uid": "aB89xZ... (string)",
  "email": "student@university.edu (string)",
  "displayName": "Alex Henderson (string)",
  "photoURL": "https://... (optional string)",
  "createdAt": "2026-08-08T14:30:00.000Z (ISO string / Timestamp)",
  "updatedAt": "2026-08-08T14:30:00.000Z (ISO string / Timestamp)"
}
```

### B. Tasks: `users/{userId}/tasks/{taskId}`
```json
{
  "id": "tsk-172312... (string)",
  "title": "Complete Electrostatics Problem Set #4 (string)",
  "description": "Halliday & Resnick Chapter 22 (string)",
  "subjectId": "sub-phys (string)",
  "priority": "URGENT | HIGH | MEDIUM | LOW (string)",
  "dueDate": "2026-08-14 (string)",
  "status": "TODO | IN_PROGRESS | COMPLETED (string)",
  "createdAt": "2026-08-08T14:30:00.000Z",
  "completedAt": "2026-08-08T15:15:00.000Z (optional)"
}
```

### C. Schedule Items: `users/{userId}/schedule/{scheduleId}`
```json
{
  "id": "sch-172312... (string)",
  "title": "Electrostatics Deep Dive (string)",
  "subjectId": "sub-phys (string)",
  "topicName": "Electrostatics & Coulomb Law (string)",
  "startTime": "10:30 (HH:MM string)",
  "endTime": "11:15 (HH:MM string)",
  "date": "2026-08-08 (YYYY-MM-DD)",
  "timeOfDay": "MORNING | AFTERNOON | EVENING",
  "type": "STUDY | REVISION | QUIZ | BREAK | EXAM | OTHER",
  "priority": "URGENT | HIGH | MEDIUM | LOW",
  "status": "UPCOMING | CURRENT | COMPLETED | SKIPPED",
  "notes": "Gauss Law boundary conditions"
}
```

### D. Focus Study Sessions: `users/{userId}/studySessions/{sessionId}`
```json
{
  "id": "sess-172312... (string)",
  "subjectId": "sub-phys (string)",
  "topicName": "Electrostatics & Coulomb Law (string)",
  "durationMinutes": 45,
  "actualMinutes": 45,
  "startTime": "10:30",
  "endTime": "11:15",
  "date": "2026-08-08",
  "status": "COMPLETED | ABORTED"
}
```

### E. Study Notes: `users/{userId}/notes/{noteId}`
```json
{
  "id": "note-172312... (string)",
  "title": "Coulomb Law Formula Sheet (string)",
  "subjectId": "sub-phys (string)",
  "topicName": "Electrostatics & Coulomb Law (string)",
  "content": "# Markdown note content with LaTeX formulas... (string)",
  "tags": ["Physics", "Gauss-Law", "Midterm"],
  "createdAt": "2026-08-08T14:30:00.000Z",
  "updatedAt": "2026-08-08T14:30:00.000Z"
}
```

---

## 3. Security & Access Control

Firestore rules enforce that only the authenticated user matching `request.auth.uid == userId` can read or write documents in their tree. Global collections without user ownership are completely disallowed.
