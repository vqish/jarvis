import React from 'react';
import { useJarvis } from '../../state/JarvisContext';
import {
  LayoutDashboard,
  MessageSquare,
  CalendarCheck,
  CalendarDays,
  CheckSquare,
  Timer,
  Brain,
  FileText,
  TrendingUp,
  Settings,
  Sparkles,
  Zap,
  Activity,
} from 'lucide-react';

interface SidebarProps {
  collapsed?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = () => {
  const { activeTab, setActiveTab, focusTimer, tasks, toggleDailyBriefing } = useJarvis();

  const pendingTasksCount = tasks.filter((t) => t.status !== 'COMPLETED').length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'chat', label: 'AI Chat', icon: MessageSquare, badge: 'AI' },
    { id: 'plan', label: "Today's Plan", icon: CalendarCheck },
    { id: 'timetable', label: 'Timetable', icon: CalendarDays },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare, count: pendingTasksCount },
    { id: 'focus', label: 'Focus Timer', icon: Timer, isTimerActive: focusTimer.isRunning },
    { id: 'quiz', label: 'Quiz Mode', icon: Brain },
    { id: 'notes', label: 'Notes', icon: FileText },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 border-r border-slate-800/80 bg-slate-950/90 flex flex-col justify-between shrink-0 h-screen sticky top-0">
      {/* Brand Header */}
      <div>
        <div className="h-16 border-b border-slate-800 flex items-center px-6 gap-3">
          <div className="relative flex items-center justify-center">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-500 via-cyan-500 to-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(20,184,166,0.5)]">
              <Zap className="w-4 h-4 text-slate-950 fill-slate-950 font-bold" />
            </div>
            <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-teal-400 border-2 border-slate-950 animate-ping" />
          </div>

          <div>
            <div className="font-display font-bold text-lg tracking-wider text-slate-100 flex items-center gap-1.5">
              <span>JARVIS</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
                PROTOTYPE
              </span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono -mt-0.5">
              AI Study Engine
            </div>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="p-3 space-y-1 mt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                  isActive
                    ? 'bg-teal-500/15 text-teal-300 border border-teal-500/30 shadow-[0_0_12px_rgba(20,184,166,0.15)] font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-teal-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
                    {item.badge}
                  </span>
                )}

                {item.count !== undefined && item.count > 0 && (
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {item.count}
                  </span>
                )}

                {item.isTimerActive && (
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Assistant Quick Card */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
        <div className="rounded-xl p-3 bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 relative overflow-hidden">
          <div className="flex items-center gap-2 mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span className="text-xs font-semibold text-slate-200">Daily Study Brief</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">
            Physics exam in 6 days. 4 study blocks planned for today.
          </p>
          <button
            onClick={() => toggleDailyBriefing(true)}
            className="mt-2.5 w-full py-1.5 rounded-lg bg-teal-600/20 hover:bg-teal-600/30 text-teal-300 border border-teal-500/30 text-xs font-medium transition-all text-center flex items-center justify-center gap-1.5"
          >
            <Activity className="w-3 h-3 text-teal-400" />
            Listen / View Briefing
          </button>
        </div>
      </div>
    </aside>
  );
};
