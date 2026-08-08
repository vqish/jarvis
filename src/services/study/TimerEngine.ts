export interface FocusTimerState {
  totalSeconds: number;
  secondsRemaining: number;
  isRunning: boolean;
  isPaused: boolean;
  subjectId: string;
  topicName: string;
  sessionStartedAt?: number;
}

export class TimerEngine {
  static formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  static getProgressPercentage(secondsRemaining: number, totalSeconds: number): number {
    if (totalSeconds <= 0) return 0;
    const elapsed = totalSeconds - secondsRemaining;
    return Math.min(100, Math.max(0, Math.round((elapsed / totalSeconds) * 100)));
  }

  static createTimer(minutes: number, subjectId: string, topicName: string): FocusTimerState {
    const totalSeconds = minutes * 60;
    return {
      totalSeconds,
      secondsRemaining: totalSeconds,
      isRunning: false,
      isPaused: false,
      subjectId,
      topicName,
    };
  }
}
