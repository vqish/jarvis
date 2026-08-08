import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import {
  SystemState,
  HardwareState,
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
  Priority,
} from '../types';
import { StorageService } from '../services/storage/StorageService';
import { HardwareService } from '../services/hardware/HardwareService';
import { MockAIService } from '../services/ai/MockAIService';
import { AIContext } from '../services/ai/types';
import { TimerEngine, FocusTimerState } from '../services/study/TimerEngine';
import { VoiceService } from '../services/ai/VoiceService';

interface JarvisContextType {
  systemState: SystemState;
  hardwareState: HardwareState;
  subjects: Subject[];
  topics: Topic[];
  schedule: ScheduleItem[];
  tasks: Task[];
  exams: Exam[];
  sessions: StudySession[];
  quizQuestions: QuizQuestion[];
  notes: Note[];
  settings: UserSettings;
  chatMessages: ChatMessage[];
  focusTimer: FocusTimerState;
  activeTab: string;
  isDailyBriefingOpen: boolean;
  isSimulatorDrawerOpen: boolean;

  // Navigation & UI
  setActiveTab: (tab: string) => void;
  toggleDailyBriefing: (open?: boolean) => void;
  toggleSimulatorDrawer: (open?: boolean) => void;
  setSystemState: (state: SystemState) => void;

  // Chat & AI
  sendMessage: (text: string) => Promise<void>;
  clearChat: () => void;

  // Focus Timer Actions
  startFocusTimer: (minutes: number, subjectId: string, topicName: string) => void;
  pauseFocusTimer: () => void;
  resumeFocusTimer: () => void;
  resetFocusTimer: () => void;
  endFocusSession: (completedNormally?: boolean) => void;

  // Schedule CRUD
  addScheduleItem: (item: Omit<ScheduleItem, 'id'>) => void;
  updateScheduleItem: (id: string, updates: Partial<ScheduleItem>) => void;
  deleteScheduleItem: (id: string) => void;

  // Task CRUD
  addTask: (title: string, subjectId: string, priority: Priority, dueDate?: string) => Task;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;

  // Note CRUD
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;

  // Quiz
  recordQuizResult: (subjectId: string, topicName: string, score: number, total: number, weakAreas: string[]) => void;

  // Settings & System
  updateSettings: (updates: Partial<UserSettings>) => void;
  resetAllData: () => void;
}

const JarvisContext = createContext<JarvisContextType | null>(null);

export const JarvisProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial persistent data
  const [subjects, setSubjects] = useState<Subject[]>(() => StorageService.getSubjects());
  const [topics, setTopics] = useState<Topic[]>(() => StorageService.getTopics());
  const [schedule, setSchedule] = useState<ScheduleItem[]>(() => StorageService.getSchedule());
  const [tasks, setTasks] = useState<Task[]>(() => StorageService.getTasks());
  const [exams, setExams] = useState<Exam[]>(() => StorageService.getExams());
  const [sessions, setSessions] = useState<StudySession[]>(() => StorageService.getSessions());
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>(() => StorageService.getQuizQuestions());
  const [notes, setNotes] = useState<Note[]>(() => StorageService.getNotes());
  const [settings, setSettings] = useState<UserSettings>(() => StorageService.getSettings());
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => StorageService.getChatMessages());

  // UI state
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isDailyBriefingOpen, setIsDailyBriefingOpen] = useState<boolean>(false);
  const [isSimulatorDrawerOpen, setIsSimulatorDrawerOpen] = useState<boolean>(false);

  // Hardware state sync
  const [hardwareState, setHardwareState] = useState<HardwareState>(() => HardwareService.getHardwareState());
  const [systemState, setSystemStateInternal] = useState<SystemState>('IDLE');

  // Focus Timer
  const [focusTimer, setFocusTimer] = useState<FocusTimerState>(() =>
    TimerEngine.createTimer(settings.defaultFocusDuration || 45, 'sub-phys', 'Electrostatics & Coulomb Law')
  );

  const aiServiceRef = useRef<MockAIService>(new MockAIService());
  const timerIntervalRef = useRef<any>(null);

  // Synchronize Hardware state listener
  useEffect(() => {
    const unsubscribe = HardwareService.onStateChange((state) => {
      setHardwareState(state);
    });
    return () => unsubscribe();
  }, []);

  // Sync settings theme to document HTML class
  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === 'oled') {
      root.classList.add('dark');
      document.body.style.backgroundColor = '#000000';
    } else if (settings.theme === 'dark') {
      root.classList.add('dark');
      document.body.style.backgroundColor = '#090d16';
    } else {
      root.classList.remove('dark');
      document.body.style.backgroundColor = '#f8fafc';
    }
  }, [settings.theme]);

  // Persist items
  useEffect(() => StorageService.saveSubjects(subjects), [subjects]);
  useEffect(() => StorageService.saveTopics(topics), [topics]);
  useEffect(() => StorageService.saveSchedule(schedule), [schedule]);
  useEffect(() => StorageService.saveTasks(tasks), [tasks]);
  useEffect(() => StorageService.saveExams(exams), [exams]);
  useEffect(() => StorageService.saveSessions(sessions), [sessions]);
  useEffect(() => StorageService.saveQuizQuestions(quizQuestions), [quizQuestions]);
  useEffect(() => StorageService.saveNotes(notes), [notes]);
  useEffect(() => StorageService.saveSettings(settings), [settings]);
  useEffect(() => StorageService.saveChatMessages(chatMessages), [chatMessages]);

  const setSystemState = useCallback((state: SystemState) => {
    setSystemStateInternal(state);
    HardwareService.setSystemState(state);
  }, []);

  // Focus Timer Heartbeat
  useEffect(() => {
    if (focusTimer.isRunning && !focusTimer.isPaused) {
      timerIntervalRef.current = setInterval(() => {
        setFocusTimer((prev) => {
          if (prev.secondsRemaining <= 1) {
            clearInterval(timerIntervalRef.current);
            // Session Complete!
            const completedMinutes = Math.round(prev.totalSeconds / 60);
            
            // Record study session
            const newSession: StudySession = {
              id: `sess-${Date.now()}`,
              subjectId: prev.subjectId,
              topicName: prev.topicName,
              durationMinutes: completedMinutes,
              actualMinutes: completedMinutes,
              startTime: new Date(prev.sessionStartedAt || Date.now() - prev.totalSeconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              endTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              date: new Date().toISOString().split('T')[0],
              status: 'COMPLETED',
            };
            setSessions((s) => [newSession, ...s]);

            // Update subject total study time
            setSubjects((subs) =>
              subs.map((sub) =>
                sub.id === prev.subjectId
                  ? { ...sub, totalStudyMinutes: sub.totalStudyMinutes + completedMinutes }
                  : sub
              )
            );

            // Update schedule item if matching
            setSchedule((sch) =>
              sch.map((item) =>
                item.subjectId === prev.subjectId && item.status === 'UPCOMING'
                  ? { ...item, status: 'COMPLETED' }
                  : item
              )
            );

            // Hardware sync
            HardwareService.setSystemState('COMPLETED');

            if (settings.voiceOutput) {
              VoiceService.speak(`Focus session complete. You logged ${completedMinutes} minutes on ${prev.topicName}. Excellent focus.`);
            }

            return {
              ...prev,
              secondsRemaining: 0,
              isRunning: false,
              isPaused: false,
            };
          }

          const nextRemaining = prev.secondsRemaining - 1;
          const sub = subjects.find((s) => s.id === prev.subjectId);
          HardwareService.setStudyState(sub?.name || 'STUDY', prev.topicName, nextRemaining, prev.totalSeconds);

          return {
            ...prev,
            secondsRemaining: nextRemaining,
          };
        });
      }, 1000);
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [focusTimer.isRunning, focusTimer.isPaused, subjects, settings.voiceOutput]);

  // Focus Timer actions
  const startFocusTimer = useCallback((minutes: number, subjectId: string, topicName: string) => {
    const totalSecs = minutes * 60;
    const sub = subjects.find((s) => s.id === subjectId);

    setFocusTimer({
      totalSeconds: totalSecs,
      secondsRemaining: totalSecs,
      isRunning: true,
      isPaused: false,
      subjectId,
      topicName,
      sessionStartedAt: Date.now(),
    });

    setSystemState('STUDYING');
    HardwareService.setStudyState(sub?.name || 'STUDY', topicName, totalSecs, totalSecs);

    if (settings.voiceOutput) {
      VoiceService.speak(`Starting ${minutes} minute study session on ${sub?.name || 'your subject'}. Let's focus.`);
    }
  }, [subjects, setSystemState, settings.voiceOutput]);

  const pauseFocusTimer = useCallback(() => {
    setFocusTimer((prev) => ({ ...prev, isPaused: true }));
    setSystemState('PAUSED');
  }, [setSystemState]);

  const resumeFocusTimer = useCallback(() => {
    setFocusTimer((prev) => ({ ...prev, isPaused: false }));
    setSystemState('STUDYING');
  }, [setSystemState]);

  const resetFocusTimer = useCallback(() => {
    setFocusTimer((prev) => ({
      ...prev,
      secondsRemaining: prev.totalSeconds,
      isRunning: false,
      isPaused: false,
    }));
    setSystemState('IDLE');
  }, [setSystemState]);

  const endFocusSession = useCallback((completedNormally = true) => {
    if (focusTimer.isRunning) {
      const elapsedSeconds = focusTimer.totalSeconds - focusTimer.secondsRemaining;
      const elapsedMinutes = Math.max(1, Math.round(elapsedSeconds / 60));

      if (elapsedMinutes >= 1) {
        const newSession: StudySession = {
          id: `sess-${Date.now()}`,
          subjectId: focusTimer.subjectId,
          topicName: focusTimer.topicName,
          durationMinutes: Math.round(focusTimer.totalSeconds / 60),
          actualMinutes: elapsedMinutes,
          startTime: new Date(focusTimer.sessionStartedAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          endTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          date: new Date().toISOString().split('T')[0],
          status: completedNormally ? 'COMPLETED' : 'ABORTED',
        };
        setSessions((s) => [newSession, ...s]);
      }
    }

    setFocusTimer((prev) => ({
      ...prev,
      isRunning: false,
      isPaused: false,
      secondsRemaining: prev.totalSeconds,
    }));
    setSystemState('IDLE');
  }, [focusTimer, setSystemState]);

  // AI Chat Messaging
  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'USER',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const thinkingMessage: ChatMessage = {
      id: `msg-thinking-${Date.now()}`,
      sender: 'JARVIS',
      text: 'Thinking...',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isThinking: true,
    };

    setChatMessages((prev) => [...prev, userMessage, thinkingMessage]);
    setSystemState('THINKING');

    const context: AIContext = {
      currentTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      schedule,
      tasks,
      exams,
      sessions,
      subjects,
      topics,
      notes,
      quizQuestions,
      activeFocusSession: {
        subjectId: focusTimer.subjectId,
        topicName: focusTimer.topicName,
        secondsRemaining: focusTimer.secondsRemaining,
        isRunning: focusTimer.isRunning,
      },
    };

    const stateMutators = {
      addTask: (title: string, subjectId: string, priority: Priority) => addTask(title, subjectId, priority),
      startFocusTimer: (dur: number, subId: string, topName: string) => startFocusTimer(dur, subId, topName),
    };

    try {
      const response = await aiServiceRef.current.processMessage(text, context, stateMutators);

      const jarvisMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'JARVIS',
        text: response.message,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        intent: response.intent,
        toolCalls: response.toolCalls,
      };

      setChatMessages((prev) => prev.filter((m) => !m.isThinking).concat(jarvisMessage));
      setSystemState('RESPONDING');

      if (settings.voiceOutput) {
        VoiceService.speak(response.message);
      }

      // If action triggered
      if (response.actionTriggered) {
        if (response.actionTriggered.type === 'START_FOCUS') {
          setActiveTab('focus');
        } else if (response.actionTriggered.type === 'OPEN_QUIZ') {
          setActiveTab('quiz');
        }
      }

      setTimeout(() => {
        if (focusTimer.isRunning && !focusTimer.isPaused) {
          setSystemState('STUDYING');
        } else {
          setSystemState('IDLE');
        }
      }, 1500);
    } catch (err) {
      console.error('[JarvisContext] AI error:', err);
      setSystemState('ERROR');
      setChatMessages((prev) =>
        prev.filter((m) => !m.isThinking).concat({
          id: `msg-err-${Date.now()}`,
          sender: 'JARVIS',
          text: 'I encountered a temporary cognitive error processing your request. Please try again.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        })
      );
    }
  };

  const clearChat = () => {
    setChatMessages([
      {
        id: 'msg-fresh',
        sender: 'JARVIS',
        text: 'Chat history cleared. Systems ready. What would you like to focus on now?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
    ]);
  };

  // Schedule CRUD
  const addScheduleItem = (item: Omit<ScheduleItem, 'id'>) => {
    const newItem: ScheduleItem = { ...item, id: `sch-${Date.now()}` };
    setSchedule((prev) => [...prev, newItem]);
  };

  const updateScheduleItem = (id: string, updates: Partial<ScheduleItem>) => {
    setSchedule((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  };

  const deleteScheduleItem = (id: string) => {
    setSchedule((prev) => prev.filter((s) => s.id !== id));
  };

  // Task CRUD
  const addTask = (title: string, subjectId: string, priority: Priority, dueDate?: string): Task => {
    const newTask: Task = {
      id: `tsk-${Date.now()}`,
      title,
      description: '',
      subjectId,
      priority,
      dueDate: dueDate || new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      status: 'TODO',
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [newTask, ...prev]);
    return newTask;
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const updated = { ...t, ...updates };
          if (updates.status === 'COMPLETED' && !t.completedAt) {
            updated.completedAt = new Date().toISOString();
          }
          return updated;
        }
        return t;
      })
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  // Note CRUD
  const addNote = (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newNote: Note = {
      ...note,
      id: `note-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };
    setNotes((prev) => [newNote, ...prev]);
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, ...updates, updatedAt: new Date().toISOString() } : n))
    );
  };

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  // Quiz
  const recordQuizResult = (
    subjectId: string,
    topicName: string,
    score: number,
    total: number,
    weakAreas: string[]
  ) => {
    // Update mastery on matching topic
    setTopics((prev) =>
      prev.map((t) => {
        if (t.name.toLowerCase().includes(topicName.toLowerCase()) || topicName.toLowerCase().includes(t.name.toLowerCase())) {
          return {
            ...t,
            masteryLevel: Math.round(score),
            isWeakArea: score < 75,
          };
        }
        return t;
      })
    );
  };

  // Settings
  const updateSettings = (updates: Partial<UserSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...updates };
      if (updates.hardwareMode) {
        HardwareService.setMode(updates.hardwareMode, next.esp32IpAddress, next.esp32Port);
      }
      return next;
    });
  };

  const resetAllData = () => {
    StorageService.resetAllToDefaults();
    setSubjects(StorageService.getSubjects());
    setTopics(StorageService.getTopics());
    setSchedule(StorageService.getSchedule());
    setTasks(StorageService.getTasks());
    setExams(StorageService.getExams());
    setSessions(StorageService.getSessions());
    setQuizQuestions(StorageService.getQuizQuestions());
    setNotes(StorageService.getNotes());
    setSettings(StorageService.getSettings());
    setChatMessages(StorageService.getChatMessages());
    setSystemState('IDLE');
  };

  const toggleDailyBriefing = (open?: boolean) => {
    setIsDailyBriefingOpen((prev) => (open !== undefined ? open : !prev));
  };

  const toggleSimulatorDrawer = (open?: boolean) => {
    setIsSimulatorDrawerOpen((prev) => (open !== undefined ? open : !prev));
  };

  return (
    <JarvisContext.Provider
      value={{
        systemState,
        hardwareState,
        subjects,
        topics,
        schedule,
        tasks,
        exams,
        sessions,
        quizQuestions,
        notes,
        settings,
        chatMessages,
        focusTimer,
        activeTab,
        isDailyBriefingOpen,
        isSimulatorDrawerOpen,

        setActiveTab,
        toggleDailyBriefing,
        toggleSimulatorDrawer,
        setSystemState,

        sendMessage,
        clearChat,

        startFocusTimer,
        pauseFocusTimer,
        resumeFocusTimer,
        resetFocusTimer,
        endFocusSession,

        addScheduleItem,
        updateScheduleItem,
        deleteScheduleItem,

        addTask,
        updateTask,
        deleteTask,

        addNote,
        updateNote,
        deleteNote,

        recordQuizResult,
        updateSettings,
        resetAllData,
      }}
    >
      {children}
    </JarvisContext.Provider>
  );
};

export const useJarvis = () => {
  const context = useContext(JarvisContext);
  if (!context) {
    throw new Error('useJarvis must be used within a JarvisProvider');
  }
  return context;
};
