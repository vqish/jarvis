import {
  Subject,
  Topic,
  ScheduleItem,
  Task,
  Exam,
  StudySession,
  Note,
  UserSettings,
} from '../../types';

export interface ITaskRepository {
  getTasks(userId?: string): Promise<Task[]>;
  saveTasks(tasks: Task[], userId?: string): Promise<void>;
  createTask(task: Task, userId?: string): Promise<Task>;
  updateTask(taskId: string, updates: Partial<Task>, userId?: string): Promise<void>;
  deleteTask(taskId: string, userId?: string): Promise<void>;
}

export interface IScheduleRepository {
  getSchedule(userId?: string): Promise<ScheduleItem[]>;
  saveSchedule(schedule: ScheduleItem[], userId?: string): Promise<void>;
  createScheduleItem(item: ScheduleItem, userId?: string): Promise<ScheduleItem>;
  updateScheduleItem(itemId: string, updates: Partial<ScheduleItem>, userId?: string): Promise<void>;
  deleteScheduleItem(itemId: string, userId?: string): Promise<void>;
}

export interface INotesRepository {
  getNotes(userId?: string): Promise<Note[]>;
  saveNotes(notes: Note[], userId?: string): Promise<void>;
  createNote(note: Note, userId?: string): Promise<Note>;
  updateNote(noteId: string, updates: Partial<Note>, userId?: string): Promise<void>;
  deleteNote(noteId: string, userId?: string): Promise<void>;
}

export interface IStudySessionRepository {
  getSessions(userId?: string): Promise<StudySession[]>;
  saveSessions(sessions: StudySession[], userId?: string): Promise<void>;
  logSession(session: StudySession, userId?: string): Promise<StudySession>;
}

export interface ISubjectRepository {
  getSubjects(userId?: string): Promise<Subject[]>;
  saveSubjects(subjects: Subject[], userId?: string): Promise<void>;
}

export interface IExamRepository {
  getExams(userId?: string): Promise<Exam[]>;
  saveExams(exams: Exam[], userId?: string): Promise<void>;
}

export interface ISettingsRepository {
  getSettings(userId?: string): Promise<UserSettings>;
  saveSettings(settings: UserSettings, userId?: string): Promise<void>;
}
