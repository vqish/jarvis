import {
  ScheduleItem,
  Task,
  Exam,
  StudySession,
  Subject,
  Topic,
  Note,
  QuizQuestion,
  ToolCallExecution,
} from '../../types';

export interface AIContext {
  currentTime: string;
  schedule: ScheduleItem[];
  tasks: Task[];
  exams: Exam[];
  sessions: StudySession[];
  subjects: Subject[];
  topics: Topic[];
  notes: Note[];
  quizQuestions: QuizQuestion[];
  activeFocusSession?: {
    subjectId: string;
    topicName: string;
    secondsRemaining: number;
    isRunning: boolean;
  };
}

export interface AIResponse {
  message: string;
  intent: string;
  toolCalls?: ToolCallExecution[];
  actionTriggered?: {
    type: 'START_FOCUS' | 'OPEN_QUIZ' | 'CREATE_TASK' | 'CREATE_SCHEDULE' | 'OPEN_PAGE';
    payload?: any;
  };
}

export interface AITool {
  name: string;
  description: string;
  parameters: Record<string, string>;
  execute: (args: Record<string, any>, context: AIContext, stateMutators: any) => Promise<any> | any;
}

export interface AIService {
  processMessage(userPrompt: string, context: AIContext, stateMutators: any): Promise<AIResponse>;
  registerTool(tool: AITool): void;
}
