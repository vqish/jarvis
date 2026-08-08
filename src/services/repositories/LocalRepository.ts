import {
  ITaskRepository,
  IScheduleRepository,
  INotesRepository,
  IStudySessionRepository,
  ISubjectRepository,
  IExamRepository,
  ISettingsRepository,
} from './types';
import {
  Subject,
  ScheduleItem,
  Task,
  Exam,
  StudySession,
  Note,
  UserSettings,
} from '../../types';
import { StorageService } from '../storage/StorageService';

export class LocalTaskRepository implements ITaskRepository {
  async getTasks(): Promise<Task[]> {
    return StorageService.getTasks();
  }
  async saveTasks(tasks: Task[]): Promise<void> {
    StorageService.saveTasks(tasks);
  }
  async createTask(task: Task): Promise<Task> {
    const list = StorageService.getTasks();
    const next = [task, ...list];
    StorageService.saveTasks(next);
    return task;
  }
  async updateTask(taskId: string, updates: Partial<Task>): Promise<void> {
    const list = StorageService.getTasks();
    const next = list.map((t) => (t.id === taskId ? { ...t, ...updates } : t));
    StorageService.saveTasks(next);
  }
  async deleteTask(taskId: string): Promise<void> {
    const list = StorageService.getTasks();
    const next = list.filter((t) => t.id !== taskId);
    StorageService.saveTasks(next);
  }
}

export class LocalScheduleRepository implements IScheduleRepository {
  async getSchedule(): Promise<ScheduleItem[]> {
    return StorageService.getSchedule();
  }
  async saveSchedule(schedule: ScheduleItem[]): Promise<void> {
    StorageService.saveSchedule(schedule);
  }
  async createScheduleItem(item: ScheduleItem): Promise<ScheduleItem> {
    const list = StorageService.getSchedule();
    const next = [...list, item];
    StorageService.saveSchedule(next);
    return item;
  }
  async updateScheduleItem(itemId: string, updates: Partial<ScheduleItem>): Promise<void> {
    const list = StorageService.getSchedule();
    const next = list.map((s) => (s.id === itemId ? { ...s, ...updates } : s));
    StorageService.saveSchedule(next);
  }
  async deleteScheduleItem(itemId: string): Promise<void> {
    const list = StorageService.getSchedule();
    const next = list.filter((s) => s.id !== itemId);
    StorageService.saveSchedule(next);
  }
}

export class LocalNotesRepository implements INotesRepository {
  async getNotes(): Promise<Note[]> {
    return StorageService.getNotes();
  }
  async saveNotes(notes: Note[]): Promise<void> {
    StorageService.saveNotes(notes);
  }
  async createNote(note: Note): Promise<Note> {
    const list = StorageService.getNotes();
    const next = [note, ...list];
    StorageService.saveNotes(next);
    return note;
  }
  async updateNote(noteId: string, updates: Partial<Note>): Promise<void> {
    const list = StorageService.getNotes();
    const next = list.map((n) => (n.id === noteId ? { ...n, ...updates } : n));
    StorageService.saveNotes(next);
  }
  async deleteNote(noteId: string): Promise<void> {
    const list = StorageService.getNotes();
    const next = list.filter((n) => n.id !== noteId);
    StorageService.saveNotes(next);
  }
}

export class LocalStudySessionRepository implements IStudySessionRepository {
  async getSessions(): Promise<StudySession[]> {
    return StorageService.getSessions();
  }
  async saveSessions(sessions: StudySession[]): Promise<void> {
    StorageService.saveSessions(sessions);
  }
  async logSession(session: StudySession): Promise<StudySession> {
    const list = StorageService.getSessions();
    const next = [session, ...list];
    StorageService.saveSessions(next);
    return session;
  }
}

export class LocalSubjectRepository implements ISubjectRepository {
  async getSubjects(): Promise<Subject[]> {
    return StorageService.getSubjects();
  }
  async saveSubjects(subjects: Subject[]): Promise<void> {
    StorageService.saveSubjects(subjects);
  }
}

export class LocalExamRepository implements IExamRepository {
  async getExams(): Promise<Exam[]> {
    return StorageService.getExams();
  }
  async saveExams(exams: Exam[]): Promise<void> {
    StorageService.saveExams(exams);
  }
}

export class LocalSettingsRepository implements ISettingsRepository {
  async getSettings(): Promise<UserSettings> {
    return StorageService.getSettings();
  }
  async saveSettings(settings: UserSettings): Promise<void> {
    StorageService.saveSettings(settings);
  }
}
