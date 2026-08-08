import { describe, it, expect } from 'vitest';
import { ScheduleEngine } from '../src/services/study/ScheduleEngine';
import { TaskEngine } from '../src/services/study/TaskEngine';
import { TimerEngine } from '../src/services/study/TimerEngine';
import { IntentParser } from '../src/services/ai/IntentParser';
import { SimulatorHardwareAdapter } from '../src/services/hardware/SimulatorHardwareAdapter';
import { INITIAL_SCHEDULE, INITIAL_TASKS } from '../src/state/initialData';

describe('ScheduleEngine', () => {
  it('groups items into morning, afternoon, and evening', () => {
    const grouped = ScheduleEngine.getGroupedSchedule(INITIAL_SCHEDULE);
    expect(grouped.morning.length).toBeGreaterThan(0);
    expect(grouped.afternoon.length).toBeGreaterThan(0);
    expect(grouped.evening.length).toBeGreaterThan(0);
  });

  it('retrieves the next upcoming activity', () => {
    const next = ScheduleEngine.getNextScheduledActivity(INITIAL_SCHEDULE);
    expect(next).toBeDefined();
    expect(next?.startTime).toBeDefined();
  });
});

describe('TaskEngine', () => {
  it('sorts tasks placing URGENT tasks ahead of LOW tasks', () => {
    const sorted = TaskEngine.sortTasks(INITIAL_TASKS);
    expect(sorted[0].priority).toBe('URGENT');
  });

  it('computes task completion metrics accurately', () => {
    const stats = TaskEngine.getCompletionStats(INITIAL_TASKS);
    expect(stats.total).toBe(INITIAL_TASKS.length);
    expect(stats.completed).toBeGreaterThanOrEqual(1);
    expect(stats.pending).toBeGreaterThanOrEqual(1);
  });
});

describe('TimerEngine', () => {
  it('formats seconds into MM:SS format', () => {
    expect(TimerEngine.formatTime(2700)).toBe('45:00');
    expect(TimerEngine.formatTime(1500)).toBe('25:00');
    expect(TimerEngine.formatTime(65)).toBe('01:05');
  });

  it('calculates progress percentage correctly', () => {
    expect(TimerEngine.getProgressPercentage(1350, 2700)).toBe(50);
    expect(TimerEngine.getProgressPercentage(0, 2700)).toBe(100);
  });
});

describe('IntentParser', () => {
  it('detects next activity intent', () => {
    const res = IntentParser.parse('Jarvis, what should I study now?');
    expect(res.intent).toBe('GET_NEXT_OR_RECOMMENDED');
  });

  it('detects focus session with custom duration and subject', () => {
    const res = IntentParser.parse('Start a 45 minute study session on physics');
    expect(res.intent).toBe('START_FOCUS_SESSION');
    expect(res.extractedArgs.duration).toBe(45);
    expect(res.extractedArgs.subjectId).toBe('sub-phys');
  });

  it('detects quiz intent', () => {
    const res = IntentParser.parse('Quiz me on chemistry');
    expect(res.intent).toBe('START_QUIZ');
    expect(res.extractedArgs.subjectId).toBe('sub-chem');
  });

  it('detects academic explanation queries', () => {
    const res = IntentParser.parse("Explain Newton's laws");
    expect(res.intent).toBe('EXPLAIN_CONCEPT');
  });
});

describe('SimulatorHardwareAdapter', () => {
  it('initializes and switches system states', async () => {
    const adapter = new SimulatorHardwareAdapter();
    await adapter.initialize();
    const state = adapter.getHardwareState();

    expect(state.connected).toBe(true);
    expect(state.systemStatus).toBe('IDLE');
  });

  it('activates Study mode and Green LED on study session trigger', () => {
    const adapter = new SimulatorHardwareAdapter();
    adapter.setStudyState('Physics', 'Electrostatics', 2700, 2700);
    const state = adapter.getHardwareState();

    expect(state.systemStatus).toBe('STUDYING');
    expect(state.ledStudyGreen).toBe(true);
    expect(state.oledMode).toBe('STUDY');
  });
});
