import { Task, Priority } from '../../types';

const PRIORITY_ORDER: Record<Priority, number> = {
  URGENT: 4,
  HIGH: 3,
  MEDIUM: 2,
  LOW: 1,
};

export class TaskEngine {
  static sortTasks(tasks: Task[]): Task[] {
    return [...tasks].sort((a, b) => {
      // First incomplete over completed
      if (a.status === 'COMPLETED' && b.status !== 'COMPLETED') return 1;
      if (a.status !== 'COMPLETED' && b.status === 'COMPLETED') return -1;
      // Priority descending
      const prioDiff = PRIORITY_ORDER[b.priority] - PRIORITY_ORDER[a.priority];
      if (prioDiff !== 0) return prioDiff;
      // Due date ascending
      return a.dueDate.localeCompare(b.dueDate);
    });
  }

  static getCompletionStats(tasks: Task[]): { total: number; completed: number; pending: number; percent: number } {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === 'COMPLETED').length;
    const pending = total - completed;
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
    return { total, completed, pending, percent };
  }
}
