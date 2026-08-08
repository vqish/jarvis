import { StudySession, Topic, Exam, Subject } from '../../types';

export interface StudyAnalyticsSummary {
  todayStudyMinutes: number;
  weeklyStudyMinutes: number;
  sessionsCompletedToday: number;
  totalSessionsCompleted: number;
  subjectBreakdown: { subjectId: string; subjectName: string; color: string; minutes: number; percentage: number }[];
  strongTopics: Topic[];
  weakTopics: Topic[];
  recommendedRevision: {
    subjectId: string;
    subjectName: string;
    topicName: string;
    reason: string;
    urgentExamInDays?: number;
  }[];
}

export class StudyEngine {
  static getTodayStudyMinutes(sessions: StudySession[]): number {
    const todayStr = new Date().toISOString().split('T')[0];
    return sessions
      .filter((s) => s.date === todayStr && s.status === 'COMPLETED')
      .reduce((acc, s) => acc + (s.actualMinutes || s.durationMinutes), 0);
  }

  static getWeeklyStudyMinutes(sessions: StudySession[]): number {
    const oneWeekAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];
    return sessions
      .filter((s) => s.date >= oneWeekAgo && s.status === 'COMPLETED')
      .reduce((acc, s) => acc + (s.actualMinutes || s.durationMinutes), 0);
  }

  static getAnalyticsSummary(
    sessions: StudySession[],
    subjects: Subject[],
    topics: Topic[],
    exams: Exam[]
  ): StudyAnalyticsSummary {
    const todayStr = new Date().toISOString().split('T')[0];
    const todaySessions = sessions.filter((s) => s.date === todayStr && s.status === 'COMPLETED');
    const todayStudyMinutes = todaySessions.reduce((acc, s) => acc + (s.actualMinutes || s.durationMinutes), 0);
    const weeklyStudyMinutes = this.getWeeklyStudyMinutes(sessions);

    // Subject breakdown
    const subjectMap: Record<string, number> = {};
    sessions
      .filter((s) => s.status === 'COMPLETED')
      .forEach((s) => {
        subjectMap[s.subjectId] = (subjectMap[s.subjectId] || 0) + (s.actualMinutes || s.durationMinutes);
      });

    const totalMinutes = Object.values(subjectMap).reduce((a, b) => a + b, 0) || 1;
    const subjectBreakdown = subjects.map((sub) => {
      const mins = subjectMap[sub.id] || 0;
      return {
        subjectId: sub.id,
        subjectName: sub.name,
        color: sub.color,
        minutes: mins,
        percentage: Math.round((mins / totalMinutes) * 100),
      };
    });

    const strongTopics = topics.filter((t) => t.masteryLevel >= 80);
    const weakTopics = topics.filter((t) => t.masteryLevel < 70 || t.isWeakArea);

    // Recommendations based on upcoming exams and weak areas
    const recommendations: StudyAnalyticsSummary['recommendedRevision'] = [];

    // Find nearest exam
    const sortedExams = [...exams].sort((a, b) => new Date(a.examDate).getTime() - new Date(b.examDate).getTime());
    if (sortedExams.length > 0) {
      const nextExam = sortedExams[0];
      const examDate = new Date(nextExam.examDate);
      const daysRemaining = Math.max(0, Math.ceil((examDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
      const sub = subjects.find((s) => s.id === nextExam.subjectId);
      const weakInExamSub = weakTopics.find((t) => t.subjectId === nextExam.subjectId);

      recommendations.push({
        subjectId: nextExam.subjectId,
        subjectName: sub?.name || 'Subject',
        topicName: weakInExamSub?.name || nextExam.topicsCovered[0] || 'Core Review',
        reason: `Upcoming ${nextExam.title} in ${daysRemaining} days (Target: ${nextExam.targetScore}%).`,
        urgentExamInDays: daysRemaining,
      });
    }

    // Add weak area recommendation
    weakTopics.slice(0, 2).forEach((wt) => {
      const sub = subjects.find((s) => s.id === wt.subjectId);
      if (!recommendations.some((r) => r.topicName === wt.name)) {
        recommendations.push({
          subjectId: wt.subjectId,
          subjectName: sub?.name || 'Subject',
          topicName: wt.name,
          reason: `Mastery is currently at ${wt.masteryLevel}%. Active recall session recommended.`,
        });
      }
    });

    return {
      todayStudyMinutes,
      weeklyStudyMinutes,
      sessionsCompletedToday: todaySessions.length,
      totalSessionsCompleted: sessions.filter((s) => s.status === 'COMPLETED').length,
      subjectBreakdown,
      strongTopics,
      weakTopics,
      recommendedRevision: recommendations,
    };
  }
}
