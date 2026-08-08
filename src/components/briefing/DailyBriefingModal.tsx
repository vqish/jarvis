import React, { useEffect } from 'react';
import { useJarvis } from '../../state/JarvisContext';
import { Sparkles, X, Volume2, Play, Calendar, AlertCircle, CheckCircle2, Flame } from 'lucide-react';
import { VoiceService } from '../../services/ai/VoiceService';

export const DailyBriefingModal: React.FC = () => {
  const { 
    isDailyBriefingOpen, 
    toggleDailyBriefing, 
    schedule, 
    exams, 
    startFocusTimer,
    setActiveTab,
    settings 
  } = useJarvis();

  if (!isDailyBriefingOpen) return null;

  const totalSessionsToday = schedule.length;
  const nextSession = schedule.find((s) => s.status === 'UPCOMING' || s.status === 'CURRENT');
  const sortedExams = [...exams].sort((a, b) => new Date(a.examDate).getTime() - new Date(b.examDate).getTime());
  const nearestExam = sortedExams[0];
  const daysToExam = nearestExam
    ? Math.max(0, Math.ceil((new Date(nearestExam.examDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 6;

  const briefingSpeech = `Good morning. Here is what you need to know today. You have ${totalSessionsToday} study sessions planned today. Your next session is ${nextSession?.title || 'Physics'} at ${nextSession?.startTime || '10:30'}. Your highest priority subject is Physics. You have a midterm exam in ${daysToExam} days. I recommend completing your next scheduled session.`;

  const handleSpeak = () => {
    VoiceService.speak(briefingSpeech);
  };

  const handleStartNextSession = () => {
    toggleDailyBriefing(false);
    if (nextSession) {
      startFocusTimer(45, nextSession.subjectId, nextSession.topicName);
      setActiveTab('focus');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 rounded-2xl border border-teal-500/40 shadow-[0_0_50px_rgba(20,184,166,0.25)] p-6 relative overflow-hidden">
        {/* Decorative Top Glow */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-64 h-24 bg-teal-500/20 rounded-full blur-2xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-teal-500/20 text-teal-300 border border-teal-500/40">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-display font-bold text-slate-100">JARVIS Daily Briefing</h3>
              <p className="text-xs text-slate-400 font-mono">Dynamic AI Morning Study Directive</p>
            </div>
          </div>

          <button
            onClick={() => toggleDailyBriefing(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Briefing Content */}
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-teal-950/30 border border-teal-500/30">
            <div className="text-sm font-semibold text-teal-300 uppercase tracking-wide font-mono mb-1">
              GOOD MORNING
            </div>
            <p className="text-base text-slate-200 leading-relaxed font-medium">
              Here is what you need to know today.
            </p>
          </div>

          {/* Key Bullet Points */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs">
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-start gap-3">
              <Calendar className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-slate-400">Planned Sessions:</span>
                <p className="text-slate-100 font-semibold mt-0.5">{totalSessionsToday} Sessions Today</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-start gap-3">
              <Flame className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-slate-400">Next Focus Block:</span>
                <p className="text-slate-100 font-semibold mt-0.5">
                  {nextSession ? `${nextSession.subjectId === 'sub-phys' ? 'Physics' : nextSession.title} @ ${nextSession.startTime}` : 'All complete'}
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-slate-400">Highest Priority:</span>
                <p className="text-amber-300 font-semibold mt-0.5">Physics (Electrostatics)</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-slate-400">Upcoming Exam:</span>
                <p className="text-emerald-300 font-semibold mt-0.5">
                  {nearestExam?.title || 'Physics Exam'} ({daysToExam} days)
                </p>
              </div>
            </div>
          </div>

          {/* AI Recommendation Highlight */}
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            <span className="text-slate-400 font-mono uppercase font-bold text-[10px]">
              Jarvis Recommendation:
            </span>
            <p className="text-slate-200 mt-1">
              "I recommend completing the next Physics session before starting another task to maximize concept retention before your midterm."
            </p>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
          <button
            onClick={handleSpeak}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs border border-slate-700 flex items-center gap-2 transition-all"
          >
            <Volume2 className="w-4 h-4 text-teal-400" />
            <span>Read Aloud</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleDailyBriefing(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-all"
            >
              Dismiss
            </button>
            <button
              onClick={handleStartNextSession}
              className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-teal-500/25 flex items-center gap-1.5 transition-all active:scale-95"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Start Next Session</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
