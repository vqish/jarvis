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
import { FirestoreService } from '../firebase/firestore';
import { db } from '../../lib/firebase';

export class FirebaseTaskRepository implements ITaskRepository {
  async getTasks(userId = 'default_user'): Promise<Task[]> {
    return FirestoreService.fetchCollection<Task>(userId, 'tasks');
  }
  async saveTasks(tasks: Task[], userId = 'default_user'): Promise<void> {
    for (const t of tasks) {
      await FirestoreService.setDocument(userId, 'tasks', t.id, t);
    }
  }
  async createTask(task: Task, userId = 'default_user'): Promise<Task> {
    await FirestoreService.setDocument(userId, 'tasks', task.id, task);
    return task;
  }
  async updateTask(taskId: string, updates: Partial<Task>, userId = 'default_user'): Promise<void> {
    await FirestoreService.updateDocument(userId, 'tasks', taskId, updates);
  }
  async deleteTask(taskId: string, userId = 'default_user'): Promise<void> {
    await FirestoreService.deleteDocument(userId, 'tasks', taskId);
  }
}

export class FirebaseScheduleRepository implements IScheduleRepository {
  async getSchedule(userId = 'default_user'): Promise<ScheduleItem[]> {
    return FirestoreService.fetchCollection<ScheduleItem>(userId, 'schedule');
  }
  async saveSchedule(schedule: ScheduleItem[], userId = 'default_user'): Promise<void> {
    for (const item of schedule) {
      await FirestoreService.setDocument(userId, 'schedule', item.id, item);
    }
  }
  async createScheduleItem(item: ScheduleItem, userId = 'default_user'): Promise<ScheduleItem> {
    await FirestoreService.setDocument(userId, 'schedule', item.id, item);
    return item;
  }
  async updateScheduleItem(itemId: string, updates: Partial<ScheduleItem>, userId = 'default_user'): Promise<void> {
    await FirestoreService.updateDocument(userId, 'schedule', itemId, updates);
  }
  async deleteScheduleItem(itemId: string, userId = 'default_user'): Promise<void> {
    await FirestoreService.deleteDocument(userId, 'schedule', itemId);
  }
}

export class FirebaseNotesRepository implements INotesRepository {
  async getNotes(userId = 'default_user'): Promise<Note[]> {
    return FirestoreService.fetchCollection<Note>(userId, 'notes');
  }
  async saveNotes(notes: Note[], userId = 'default_user'): Promise<void> {
    for (const note of notes) {
      await FirestoreService.setDocument(userId, 'notes', note.id, note);
    }
  }
  async createNote(note: Note, userId = 'default_user'): Promise<Note> {
    await FirestoreService.setDocument(userId, 'notes', note.id, note);
    return note;
  }
  async updateNote(noteId: string, updates: Partial<Note>, userId = 'default_user'): Promise<void> {
    await FirestoreService.updateDocument(userId, 'notes', noteId, updates);
  }
  async deleteNote(noteId: string, userId = 'default_user'): Promise<void> {
    await FirestoreService.deleteDocument(userId, 'notes', noteId);
  }
}

export class FirebaseStudySessionRepository implements IStudySessionRepository {
  async getSessions(userId = 'default_user'): Promise<StudySession[]> {
    return FirestoreService.fetchCollection<StudySession>(userId, 'studySessions');
  }
  async saveSessions(sessions: StudySession[], userId = 'default_user'): Promise<void> {
    for (const s of sessions) {
      await FirestoreService.setDocument(userId, 'studySessions', s.id, s);
    }
  }
  async logSession(session: StudySession, userId = 'default_user'): Promise<StudySession> {
    await FirestoreService.setDocument(userId, 'studySessions', session.id, session);
    return session;
  }
}

export class FirebaseSubjectRepository implements ISubjectRepository {
  async getSubjects(userId = 'default_user'): Promise<Subject[]> {
    return FirestoreService.fetchCollection<Subject>(userId, 'subjects');
  }
  async saveSubjects(subjects: Subject[], userId = 'default_user'): Promise<void> {
    for (const sub of subjects) {
      await FirestoreService.setDocument(userId, 'subjects', sub.id, sub);
    }
  }
}

export class FirebaseExamRepository implements IExamRepository {
  async getExams(userId = 'default_user'): Promise<Exam[]> {
    return FirestoreService.fetchCollection<Exam>(userId, 'exams');
  }
  async saveExams(exams: Exam[], userId = 'default_user'): Promise<void> {
    for (const ex of exams) {
      await FirestoreService.setDocument(userId, 'exams', ex.id, ex);
    }
  }
}

export class FirebaseSettingsRepository implements ISettingsRepository {
  async getSettings(userId = 'default_user'): Promise<UserSettings> {
    const list = await FirestoreService.fetchCollection<UserSettings>(userId, 'settings');
    return list[0] || ({} as UserSettings);
  }
  async saveSettings(settings: UserSettings, userId = 'default_user'): Promise<void> {
    await FirestoreService.setDocument(userId, 'settings', 'user_settings', settings);
  }
}
