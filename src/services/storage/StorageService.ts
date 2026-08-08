import {
  Subject,
  Topic,
  ScheduleItem,
  Task,
  Exam,
  StudySession,
  QuizQuestion,
  Note,
  UserSettings,
  ChatMessage,
} from '../../types';
import {
  INITIAL_SUBJECTS,
  INITIAL_TOPICS,
  INITIAL_SCHEDULE,
  INITIAL_TASKS,
  INITIAL_EXAMS,
  INITIAL_SESSIONS,
  INITIAL_QUIZ_QUESTIONS,
  INITIAL_NOTES,
  INITIAL_SETTINGS,
} from '../../state/initialData';

const STORAGE_KEYS = {
  SUBJECTS: 'jarvis_subjects_v1',
  TOPICS: 'jarvis_topics_v1',
  SCHEDULE: 'jarvis_schedule_v1',
  TASKS: 'jarvis_tasks_v1',
  EXAMS: 'jarvis_exams_v1',
  SESSIONS: 'jarvis_sessions_v1',
  QUIZ_QUESTIONS: 'jarvis_quiz_questions_v1',
  NOTES: 'jarvis_notes_v1',
  SETTINGS: 'jarvis_settings_v1',
  CHAT_MESSAGES: 'jarvis_chat_messages_v1',
};

export class StorageService {
  private static getItem<T>(key: string, defaultValue: T): T {
    try {
      if (typeof window === 'undefined') return defaultValue;
      const data = localStorage.getItem(key);
      if (!data) return defaultValue;
      return JSON.parse(data) as T;
    } catch (e) {
      console.warn(`[StorageService] Failed to read ${key}, using defaults:`, e);
      return defaultValue;
    }
  }

  private static setItem<T>(key: string, value: T): void {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (e) {
      console.error(`[StorageService] Failed to write ${key}:`, e);
    }
  }

  // Subjects
  static getSubjects(): Subject[] {
    return this.getItem<Subject[]>(STORAGE_KEYS.SUBJECTS, INITIAL_SUBJECTS);
  }
  static saveSubjects(subjects: Subject[]): void {
    this.setItem(STORAGE_KEYS.SUBJECTS, subjects);
  }

  // Topics
  static getTopics(): Topic[] {
    return this.getItem<Topic[]>(STORAGE_KEYS.TOPICS, INITIAL_TOPICS);
  }
  static saveTopics(topics: Topic[]): void {
    this.setItem(STORAGE_KEYS.TOPICS, topics);
  }

  // Schedule
  static getSchedule(): ScheduleItem[] {
    return this.getItem<ScheduleItem[]>(STORAGE_KEYS.SCHEDULE, INITIAL_SCHEDULE);
  }
  static saveSchedule(schedule: ScheduleItem[]): void {
    this.setItem(STORAGE_KEYS.SCHEDULE, schedule);
  }

  // Tasks
  static getTasks(): Task[] {
    return this.getItem<Task[]>(STORAGE_KEYS.TASKS, INITIAL_TASKS);
  }
  static saveTasks(tasks: Task[]): void {
    this.setItem(STORAGE_KEYS.TASKS, tasks);
  }

  // Exams
  static getExams(): Exam[] {
    return this.getItem<Exam[]>(STORAGE_KEYS.EXAMS, INITIAL_EXAMS);
  }
  static saveExams(exams: Exam[]): void {
    this.setItem(STORAGE_KEYS.EXAMS, exams);
  }

  // Study Sessions
  static getSessions(): StudySession[] {
    return this.getItem<StudySession[]>(STORAGE_KEYS.SESSIONS, INITIAL_SESSIONS);
  }
  static saveSessions(sessions: StudySession[]): void {
    this.setItem(STORAGE_KEYS.SESSIONS, sessions);
  }

  // Quiz Questions
  static getQuizQuestions(): QuizQuestion[] {
    return this.getItem<QuizQuestion[]>(STORAGE_KEYS.QUIZ_QUESTIONS, INITIAL_QUIZ_QUESTIONS);
  }
  static saveQuizQuestions(questions: QuizQuestion[]): void {
    this.setItem(STORAGE_KEYS.QUIZ_QUESTIONS, questions);
  }

  // Notes
  static getNotes(): Note[] {
    return this.getItem<Note[]>(STORAGE_KEYS.NOTES, INITIAL_NOTES);
  }
  static saveNotes(notes: Note[]): void {
    this.setItem(STORAGE_KEYS.NOTES, notes);
  }

  // Settings
  static getSettings(): UserSettings {
    return this.getItem<UserSettings>(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
  }
  static saveSettings(settings: UserSettings): void {
    this.setItem(STORAGE_KEYS.SETTINGS, settings);
  }

  // Chat Messages
  static getChatMessages(): ChatMessage[] {
    return this.getItem<ChatMessage[]>(STORAGE_KEYS.CHAT_MESSAGES, [
      {
        id: 'msg-welcome',
        sender: 'JARVIS',
        text: 'Good morning. All study systems are online. Today you have Physics Electrostatics scheduled at 10:30 AM. How can I assist your study workflow today?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
    ]);
  }
  static saveChatMessages(messages: ChatMessage[]): void {
    this.setItem(STORAGE_KEYS.CHAT_MESSAGES, messages);
  }

  // Reset to demo defaults
  static resetAllToDefaults(): void {
    if (typeof window === 'undefined') return;
    Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
  }
}
