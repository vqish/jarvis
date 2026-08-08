import React from 'react';
import { useJarvis } from '../state/JarvisContext';
import { StudyEngine } from '../services/study/StudyEngine';
import { 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  Brain, 
  AlertCircle, 
  Sparkles, 
  ArrowRight,
  Award
} from 'lucide-react';

export const ProgressPage: React.FC = () => {
  const { subjects, topics, exams, sessions, tasks, startFocusTimer, setActiveTab } = useJarvis();

  const analytics = StudyEngine.getAnalyticsSummary(sessions, subjects, topics, exams);
  const completedTasks = tasks.filter((t) => t.status === 'COMPLETED').length;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-2xl font-display font-bold text-slate-100">Study Analytics & Mastery</h1>
        <p className="text-xs text-slate-400 font-mono mt-1">
          Cognitive retention metrics, subject breakdown, and AI revision priorities
        </p>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <span>TODAY'S STUDY</span>
            <Clock className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-100">
            {Math.floor(analytics.todayStudyMinutes / 60)}h {analytics.todayStudyMinutes % 60}m
          </div>
          <div className="text-[11px] text-teal-400 mt-1">
            +45m compared to yesterday
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <span>WEEKLY STUDY TIME</span>
            <TrendingUp className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-100">
            {Math.round((analytics.weeklyStudyMinutes / 60) * 10) / 10} hours
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Across {analytics.totalSessionsCompleted} total sessions
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <span>TASKS SOLVED</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-100">
            {completedTasks} / {tasks.length}
          </div>
          <div className="text-[11px] text-emerald-400 mt-1">
            {tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0}% completion rate
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <span>QUIZ ACCURACY</span>
            <Brain className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-300">
            86%
          </div>
          <div className="text-[11px] text-amber-400 mt-1">
            Adaptive recall active
          </div>
        </div>
      </div>

      {/* Subject Distribution Bars */}
      <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 shadow-lg space-y-4">
        <h3 className="text-sm font-mono text-slate-300 font-bold uppercase tracking-wider">
          Subject Time Allocation & Mastery Breakdown
        </h3>

        <div className="space-y-3.5">
          {analytics.subjectBreakdown.map((item) => (
            <div key={item.subjectId} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-semibold text-slate-200">{item.subjectName}</span>
                <span className="text-slate-400">
                  {Math.floor(item.minutes / 60)}h {item.minutes % 60}m ({item.percentage}%)
                </span>
              </div>

              <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.max(5, item.percentage)}%`,
                    backgroundColor: item.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Strong vs Weak Areas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strong Areas */}
        <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 shadow-md space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 uppercase">
            <Award className="w-4 h-4" />
            <span>Strong Areas (80%+ Mastery)</span>
          </div>

          <div className="space-y-2.5">
            {analytics.strongTopics.map((topic) => {
              const sub = subjects.find((s) => s.id === topic.subjectId);
              return (
                <div
                  key={topic.id}
                  className="p-3 rounded-xl bg-slate-950/80 border border-emerald-500/20 flex items-center justify-between"
                >
                  <div>
                    <span className="text-xs font-semibold text-slate-100">{topic.name}</span>
                    <div className="text-[10px] font-mono text-slate-500">{sub?.name}</div>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    {topic.masteryLevel}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Weak Areas */}
        <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 shadow-md space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400 uppercase">
            <AlertCircle className="w-4 h-4" />
            <span>Weak Areas & Revision Targets</span>
          </div>

          <div className="space-y-2.5">
            {analytics.weakTopics.map((topic) => {
              const sub = subjects.find((s) => s.id === topic.subjectId);
              return (
                <div
                  key={topic.id}
                  className="p-3 rounded-xl bg-slate-950/80 border border-amber-500/20 flex items-center justify-between"
                >
                  <div>
                    <span className="text-xs font-semibold text-slate-100">{topic.name}</span>
                    <div className="text-[10px] font-mono text-slate-500">{sub?.name}</div>
                  </div>
                  <span className="text-xs font-mono font-bold text-amber-400">
                    {topic.masteryLevel}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recommended Revision Directive */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-teal-950/40 via-slate-900 to-slate-900 border border-teal-500/30 shadow-xl space-y-4">
        <div className="flex items-center gap-2 text-teal-400 font-mono text-xs font-bold uppercase">
          <Sparkles className="w-4 h-4" />
          <span>Recommended AI Action Items</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {analytics.recommendedRevision.map((rec, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between gap-3"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-teal-300 mb-1">
                  <span>{rec.subjectName}</span>
                  {rec.urgentExamInDays && (
                    <span className="text-amber-400 font-semibold">{rec.urgentExamInDays} days to exam</span>
                  )}
                </div>
                <h4 className="font-semibold text-slate-100 text-sm">{rec.topicName}</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{rec.reason}</p>
              </div>

              <button
                onClick={() => {
                  startFocusTimer(45, rec.subjectId, rec.topicName);
                  setActiveTab('focus');
                }}
                className="w-full py-2 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/40 text-xs font-mono font-semibold flex items-center justify-center gap-1.5 transition-all"
              >
                <span>Launch 45m Focus Block</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
