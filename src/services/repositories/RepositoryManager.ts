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
  LocalTaskRepository,
  LocalScheduleRepository,
  LocalNotesRepository,
  LocalStudySessionRepository,
  LocalSubjectRepository,
  LocalExamRepository,
  LocalSettingsRepository,
} from './LocalRepository';
import {
  FirebaseTaskRepository,
  FirebaseScheduleRepository,
  FirebaseNotesRepository,
  FirebaseStudySessionRepository,
  FirebaseSubjectRepository,
  FirebaseExamRepository,
  FirebaseSettingsRepository,
} from './FirebaseRepository';
import { isFirebaseConfigured } from '../../lib/firebase';

export interface RepositoryBundle {
  tasks: ITaskRepository;
  schedule: IScheduleRepository;
  notes: INotesRepository;
  sessions: IStudySessionRepository;
  subjects: ISubjectRepository;
  exams: IExamRepository;
  settings: ISettingsRepository;
  mode: 'LOCAL' | 'FIREBASE';
}

class RepositoryManagerImpl {
  private localBundle: RepositoryBundle;
  private firebaseBundle: RepositoryBundle;
  private activeMode: 'LOCAL' | 'FIREBASE' = 'LOCAL';

  constructor() {
    this.localBundle = {
      tasks: new LocalTaskRepository(),
      schedule: new LocalScheduleRepository(),
      notes: new LocalNotesRepository(),
      sessions: new LocalStudySessionRepository(),
      subjects: new LocalSubjectRepository(),
      exams: new LocalExamRepository(),
      settings: new LocalSettingsRepository(),
      mode: 'LOCAL',
    };

    this.firebaseBundle = {
      tasks: new FirebaseTaskRepository(),
      schedule: new FirebaseScheduleRepository(),
      notes: new FirebaseNotesRepository(),
      sessions: new FirebaseStudySessionRepository(),
      subjects: new FirebaseSubjectRepository(),
      exams: new FirebaseExamRepository(),
      settings: new FirebaseSettingsRepository(),
      mode: 'FIREBASE',
    };

    if (isFirebaseConfigured()) {
      this.activeMode = 'FIREBASE';
    }
  }

  setMode(mode: 'LOCAL' | 'FIREBASE'): void {
    this.activeMode = mode;
  }

  getActiveBundle(): RepositoryBundle {
    if (this.activeMode === 'FIREBASE' && isFirebaseConfigured()) {
      return this.firebaseBundle;
    }
    return this.localBundle;
  }
}

export const RepositoryManager = new RepositoryManagerImpl();
