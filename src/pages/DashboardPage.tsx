import React from 'react';
import { useJarvis } from '../state/JarvisContext';
import { 
  Sparkles, 
  Play, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Calendar, 
  ArrowRight, 
  Atom,
  Sigma,
  FlaskConical,
  Cpu
} from 'lucide-react';
import { StudyEngine } from '../services/study/StudyEngine';

export const DashboardPage: React.FC = () => {
  const { 
    subjects, 
    topics, 
    schedule, 
    tasks, 
    exams, 
    sessions, 
    startFocusTimer, 
    setActiveTab, 
    toggleDailyBriefing 
  } = useJarvis();

  const analytics = StudyEngine.getAnalyticsSummary(sessions, subjects, topics, exams);
  const nextSession = schedule.find((s) => s.status === 'UPCOMING' || s.status === 'CURRENT');
  const completedTasks = tasks.filter((t) => t.status === 'COMPLETED').length;
  const sortedExams = [...exams].sort((a, b) => new Date(a.examDate).getTime() - new Date(b.examDate).getTime());
  const nearestExam = sortedExams[0];
  const daysToExam = nearestExam
    ? Math.max(0, Math.ceil((new Date(nearestExam.examDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 6;

  const handleStartNextSession = () => {
    if (nextSession) {
      startFocusTimer(45, nextSession.subjectId, nextSession.topicName);
      setActiveTab('focus');
    }
  };

  const getSubjectIcon = (subId: string) => {
    switch (subId) {
      case 'sub-phys': return Atom;
      case 'sub-math': return Sigma;
      case 'sub-chem': return FlaskConical;
      default: return Cpu;
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. Greeting & Daily Hero Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-teal-950/40 border border-slate-800 shadow-2xl relative overflow-hidden">
        {/* Glow Accent */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-teal-400 font-mono text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              <span>JARVIS COGNITIVE BRIEFING</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-display font-extrabold text-slate-100">
              Good morning.
            </h1>
            <p className="text-slate-300 mt-1.5 text-sm md:text-base font-normal max-w-xl">
              Here is what you need to know today. You have <strong className="text-teal-300 font-semibold">{schedule.length} study sessions</strong> planned, and <strong className="text-amber-300 font-semibold">Physics</strong> remains your highest priority.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => toggleDailyBriefing(true)}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-all shadow active:scale-95"
            >
              Open Full Briefing
            </button>
            <button
              onClick={handleStartNextSession}
              className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-teal-500/25 flex items-center gap-2 transition-all active:scale-95"
            >
              <Play className="w-4 h-4" />
              <span>Start Next Session</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Today's Progress Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-2">
            <span>TODAY'S STUDY TIME</span>
            <Clock className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-100">
            {Math.floor(analytics.todayStudyMinutes / 60)}h {analytics.todayStudyMinutes % 60}m
          </div>
          <div className="text-xs text-slate-400 mt-1">
            Goal: 4.5 hours ({Math.min(100, Math.round((analytics.todayStudyMinutes / 270) * 100))}% reached)
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-2">
            <span>SESSIONS COMPLETED</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-100">
            {analytics.sessionsCompletedToday} <span className="text-sm font-normal text-slate-400">/ {schedule.length}</span>
          </div>
          <div className="text-xs text-emerald-400 mt-1">
            On track with today's timetable
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-2">
            <span>TASKS COMPLETED</span>
            <CheckCircle2 className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-100">
            {completedTasks} <span className="text-sm font-normal text-slate-400">/ {tasks.length}</span>
          </div>
          <div className="text-xs text-slate-400 mt-1">
            {tasks.filter((t) => t.status === 'TODO').length} pending homework/problem sets
          </div>
        </div>
      </div>

      {/* 3. Main Grid: Next Session Card & Priority Subject / Upcoming Exam */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Next Session & Today's Schedule Timeline */}
        <div className="lg:col-span-7 space-y-6">
          {nextSession && (
            <div className="p-6 rounded-2xl bg-gradient-to-br from-teal-950/40 via-slate-900 to-slate-900 border border-teal-500/40 shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-[10px] font-mono font-bold uppercase">
                    NEXT UPCOMING SESSION
                  </span>
                  <span className="text-xs font-mono text-slate-400">{nextSession.startTime}</span>
                </div>
                <span className="text-xs font-mono text-teal-400 font-semibold">45 MINUTES</span>
              </div>

              <h2 className="text-xl font-display font-bold text-slate-100">
                {nextSession.title}
              </h2>
              <p className="text-sm text-slate-300 mt-1">
                Topic: <strong className="text-slate-100 font-semibold">{nextSession.topicName}</strong>
              </p>

              <div className="mt-5 flex items-center justify-between pt-4 border-t border-slate-800">
                <span className="text-xs font-mono text-slate-400">
                  Priority: <span className="text-red-400 font-semibold">{nextSession.priority}</span>
                </span>
                <button
                  onClick={handleStartNextSession}
                  className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow flex items-center gap-1.5 transition-all"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Start Focus Timer</span>
                </button>
              </div>
            </div>
          )}

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-md">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-teal-400" />
                <h3 className="font-display font-bold text-base text-slate-100">Today's Schedule</h3>
              </div>
              <button
                onClick={() => setActiveTab('timetable')}
                className="text-xs font-mono text-teal-400 hover:text-teal-300 flex items-center gap-1"
              >
                <span>Full Timetable</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-3">
              {schedule.map((item) => {
                const isCompleted = item.status === 'COMPLETED';
                const isCurrent = item.status === 'CURRENT';
                const Icon = getSubjectIcon(item.subjectId);

                return (
                  <div
                    key={item.id}
                    className={`p-3.5 rounded-xl border transition-all flex items-center justify-between ${
                      isCurrent
                        ? 'bg-teal-500/10 border-teal-500/40 text-teal-200'
                        : isCompleted
                        ? 'bg-slate-950/60 border-slate-800/80 text-slate-400 opacity-80'
                        : 'bg-slate-900/80 border-slate-800 text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="font-mono text-xs font-semibold w-12 text-slate-400">
                        {item.startTime}
                      </div>

                      <div className="p-2 rounded-lg bg-slate-800/60 border border-slate-700 text-teal-400">
                        <Icon className="w-4 h-4" />
                      </div>

                      <div>
                        <div className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                          <span>{item.title}</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                            {item.type}
                          </span>
                        </div>
                        <div className="text-xs text-slate-400 font-mono">
                          {item.topicName}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 font-mono text-xs">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        isCompleted
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : isCurrent
                          ? 'bg-teal-950 text-teal-300 border border-teal-800'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Upcoming Exam, Priority & Recommendations */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-950/30 via-slate-900 to-slate-900 border border-amber-500/40 shadow-lg">
            <div className="flex items-center justify-between text-xs font-mono text-amber-300 mb-2">
              <span className="flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                UPCOMING EXAM
              </span>
              <span className="font-bold">{daysToExam} DAYS REMAINING</span>
            </div>

            <h3 className="text-lg font-display font-bold text-slate-100">
              {nearestExam?.title || 'Physics Midterm: Electrostatics & Magnetism'}
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              Target Score: <strong className="text-amber-300">{nearestExam?.targetScore || 92}%</strong>
            </p>

            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-400">
                Covers: {nearestExam?.topicsCovered?.slice(0, 2).join(', ') || 'Gauss Law, Potential'}
              </span>
              <button
                onClick={() => setActiveTab('quiz')}
                className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 text-xs font-medium transition-all"
              >
                Practice Quiz
              </button>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="text-[11px] font-mono text-slate-400 uppercase font-semibold mb-1">
              Priority Subject
            </div>
            <p className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              Physics is currently your highest-priority subject.
            </p>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Based on your upcoming exam in 6 days and mastery at 68% for Electrostatics.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-r from-teal-950/40 to-slate-900 border border-teal-500/30 relative">
            <div className="flex items-center gap-2 text-teal-400 text-xs font-mono font-semibold mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>JARVIS RECOMMENDATION</span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed">
              "I recommend completing the next Physics session before starting another task to maximize concept retention before your midterm."
            </p>
            <div className="mt-3 flex items-center gap-2">
              <button
                onClick={() => setActiveTab('chat')}
                className="text-[11px] font-mono text-teal-300 hover:text-teal-200 flex items-center gap-1"
              >
                <span>Ask Jarvis Why</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
