export type SystemState =
  | 'IDLE'
  | 'LISTENING'
  | 'THINKING'
  | 'RESPONDING'
  | 'STUDYING'
  | 'PAUSED'
  | 'COMPLETED'
  | 'ERROR'
  | 'OFFLINE';

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export type ScheduleType = 'STUDY' | 'REVISION' | 'QUIZ' | 'BREAK' | 'EXAM' | 'OTHER';

export type ScheduleStatus = 'UPCOMING' | 'CURRENT' | 'COMPLETED' | 'SKIPPED';

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'COMPLETED';

export interface Subject {
  id: string;
  name: string;
  code: string;
  color: string;
  iconName: string;
  totalStudyMinutes: number;
}

export interface Topic {
  id: string;
  subjectId: string;
  name: string;
  masteryLevel: number; // 0 - 100%
  isWeakArea: boolean;
}

export interface ScheduleItem {
  id: string;
  title: string;
  subjectId: string;
  topicName: string;
  startTime: string; // "10:30"
  endTime: string;   // "11:15"
  date: string;      // "2026-08-08" or relative
  timeOfDay: 'MORNING' | 'AFTERNOON' | 'EVENING';
  type: ScheduleType;
  priority: Priority;
  status: ScheduleStatus;
  notes?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  subjectId: string;
  priority: Priority;
  dueDate: string;   // "2026-08-14"
  status: TaskStatus;
  createdAt: string;
  completedAt?: string;
}

export interface Exam {
  id: string;
  subjectId: string;
  title: string;
  examDate: string;  // "2026-08-14"
  priority: Priority;
  targetScore: number;
  topicsCovered: string[];
}

export interface StudySession {
  id: string;
  subjectId: string;
  topicName: string;
  durationMinutes: number;
  actualMinutes: number;
  startTime: string;
  endTime: string;
  date: string;
  status: 'COMPLETED' | 'ABORTED';
  notes?: string;
}

export interface QuizQuestion {
  id: string;
  subjectId: string;
  topicName: string;
  questionText: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
}

export interface QuizResult {
  id: string;
  subjectId: string;
  topicName: string;
  date: string;
  totalQuestions: number;
  score: number;
  correctCount: number;
  wrongCount: number;
  weakAreas: string[];
  recommendations: string[];
}

export interface Note {
  id: string;
  title: string;
  subjectId: string;
  topicName: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ToolCallExecution {
  name: string;
  args: Record<string, any>;
  result: Record<string, any>;
}

export interface ChatMessage {
  id: string;
  sender: 'USER' | 'JARVIS' | 'SYSTEM';
  text: string;
  timestamp: string;
  intent?: string;
  toolCalls?: ToolCallExecution[];
  isThinking?: boolean;
}

export interface UserSettings {
  jarvisName: string;
  theme: 'dark' | 'light' | 'oled';
  defaultFocusDuration: number; // in minutes (e.g. 25, 45, 50, 60)
  defaultBreakDuration: number; // in minutes
  dailyGoalHours: number;       // e.g. 4.5
  soundEffects: boolean;
  voiceOutput: boolean;
  hardwareMode: 'SIMULATOR' | 'ESP32_WIFI';
  esp32IpAddress: string;
  esp32Port: number;
}

export interface HardwareState {
  systemStatus: SystemState;
  oledText: {
    line1: string;
    line2: string;
    line3: string;
    line4: string;
  };
  oledMode: 'BOOT' | 'READY' | 'STUDY' | 'THINKING' | 'MESSAGE' | 'COMPLETED' | 'PAUSED' | 'OFFLINE';
  studyProgress?: {
    subject: string;
    topic: string;
    secondsRemaining: number;
    totalSeconds: number;
  };
  ledSystemRed: boolean;
  ledAiProcessingYellow: boolean | 'BLINK' | 'PULSE';
  ledStudyGreen: boolean;
  connected: boolean;
  simulatedDeviceName: string;
  firmwareVersion: string;
  lastSyncTimestamp: number;
}
