import { describe, it, expect } from 'vitest';
import { StudyEngine } from '../src/services/study/StudyEngine';
import { INITIAL_SESSIONS, INITIAL_SUBJECTS, INITIAL_TOPICS, INITIAL_EXAMS } from '../src/state/initialData';

describe('StudyEngine Analytics', () => {
  it('calculates study minutes correctly', () => {
    const todayMins = StudyEngine.getTodayStudyMinutes(INITIAL_SESSIONS);
    expect(typeof todayMins).toBe('number');
    expect(todayMins).toBeGreaterThanOrEqual(0);
  });

  it('generates analytic summary with subject breakdown and recommendations', () => {
    const summary = StudyEngine.getAnalyticsSummary(
      INITIAL_SESSIONS,
      INITIAL_SUBJECTS,
      INITIAL_TOPICS,
      INITIAL_EXAMS
    );

    expect(summary).toBeDefined();
    expect(summary.subjectBreakdown.length).toBe(INITIAL_SUBJECTS.length);
    expect(summary.recommendedRevision.length).toBeGreaterThan(0);
    expect(summary.recommendedRevision[0].subjectId).toBe('sub-phys');
  });
});
