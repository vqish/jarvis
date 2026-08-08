import React, { useState, useEffect } from 'react';
import { useJarvis } from '../../state/JarvisContext';
import { 
  Sparkles, 
  Cpu, 
  Volume2, 
  VolumeX, 
  Radio, 
  Clock, 
  Calendar as CalendarIcon,
  Flame,
  Bot
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    systemState, 
    hardwareState, 
    settings, 
    updateSettings, 
    toggleDailyBriefing, 
    toggleSimulatorDrawer,
    isSimulatorDrawerOpen,
    activeTab
  } = useJarvis();

  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setCurrentDate(now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const getStatusBadge = () => {
    switch (systemState) {
      case 'STUDYING':
        return { text: 'STUDYING', bg: 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300', dot: 'bg-emerald-400 animate-ping' };
      case 'THINKING':
      case 'RESPONDING':
        return { text: 'AI COGNITION', bg: 'bg-amber-950/80 border-amber-500/50 text-amber-300', dot: 'bg-amber-400 animate-pulse' };
      case 'PAUSED':
        return { text: 'STUDY PAUSED', bg: 'bg-amber-950/80 border-amber-500/50 text-amber-300', dot: 'bg-amber-400' };
      case 'ERROR':
        return { text: 'ALERT / ERROR', bg: 'bg-red-950/80 border-red-500/50 text-red-300', dot: 'bg-red-400 animate-bounce' };
      default:
        return { text: 'JARVIS ONLINE', bg: 'bg-teal-950/70 border-teal-500/40 text-teal-300', dot: 'bg-teal-400' };
    }
  };

  const status = getStatusBadge();

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Left: Date, Time & Page Title */}
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-2 text-slate-300 font-mono text-xs">
          <CalendarIcon className="w-3.5 h-3.5 text-teal-400" />
          <span>{currentDate}</span>
          <span className="text-slate-600">|</span>
          <Clock className="w-3.5 h-3.5 text-teal-400" />
          <span className="font-semibold text-slate-100">{currentTime}</span>
        </div>

        {/* Dynamic Study Streak Pill */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 text-amber-300 text-xs font-medium">
          <Flame className="w-3.5 h-3.5 text-orange-400 fill-orange-400" />
          <span>5-Day Streak</span>
        </div>
      </div>

      {/* Right: Status Pill, Hardware Toggle, Audio Briefing, Profile */}
      <div className="flex items-center gap-3">
        {/* Jarvis System State Indicator */}
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-mono font-medium shadow-sm ${status.bg}`}>
          <span className={`w-2 h-2 rounded-full ${status.dot}`} />
          <span>{status.text}</span>
        </div>

        {/* Hardware Status Pill */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-700/80 text-xs font-mono text-slate-300">
          <Radio className="w-3 h-3 text-teal-400" />
          <span>{settings.hardwareMode === 'SIMULATOR' ? 'OLED SIMULATOR' : 'ESP32 (WIFI)'}</span>
        </div>

        {/* Daily Briefing Button */}
        <button
          onClick={() => toggleDailyBriefing(true)}
          className="px-3 py-1.5 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-medium flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
          title="Open Daily Study Briefing"
        >
          <Sparkles className="w-3.5 h-3.5 text-teal-400" />
          <span className="hidden md:inline">Daily Briefing</span>
        </button>

        {/* Audio Toggle */}
        <button
          onClick={() => updateSettings({ voiceOutput: !settings.voiceOutput })}
          className={`p-2 rounded-lg border transition-all ${
            settings.voiceOutput
              ? 'bg-teal-500/20 text-teal-300 border-teal-500/50'
              : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
          }`}
          title={settings.voiceOutput ? 'Voice synthesis enabled' : 'Voice synthesis muted'}
        >
          {settings.voiceOutput ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Hardware Simulator Drawer Toggle */}
        <button
          onClick={() => toggleSimulatorDrawer()}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium border flex items-center gap-1.5 transition-all ${
            isSimulatorDrawerOpen
              ? 'bg-cyan-500/20 border-cyan-500/60 text-cyan-300'
              : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
          }`}
          title="Toggle Hardware Simulator Drawer"
        >
          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden md:inline">Hardware</span>
        </button>

        {/* User Profile Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-teal-600 to-cyan-500 p-0.5 shadow-md">
            <div className="w-full h-full bg-slate-950 rounded-[7px] flex items-center justify-center text-teal-300 font-bold text-xs">
              AI
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
