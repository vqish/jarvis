import React, { useState } from 'react';
import { useJarvis } from '../state/JarvisContext';
import { TimerEngine } from '../services/study/TimerEngine';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
} from 'lucide-react';

export const FocusPage: React.FC = () => {
  const { 
    focusTimer, 
    startFocusTimer, 
    pauseFocusTimer, 
    resumeFocusTimer, 
    resetFocusTimer, 
    endFocusSession, 
    subjects, 
    topics, 
    hardwareState,
  } = useJarvis();

  const [selectedDuration, setSelectedDuration] = useState<number>(45);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(focusTimer.subjectId || 'sub-phys');
  const [selectedTopic, setSelectedTopic] = useState<string>(focusTimer.topicName || 'Electrostatics & Coulomb Law');
  const [customMinutes, setCustomMinutes] = useState<number>(30);

  const currentSubject = subjects.find((s) => s.id === selectedSubjectId) || subjects[0];
  const subjectTopics = topics.filter((t) => t.subjectId === selectedSubjectId);

  const durationOptions = [25, 45, 50, 60];

  const handleStart = (dur = selectedDuration) => {
    startFocusTimer(dur, selectedSubjectId, selectedTopic);
  };

  const handleCustomStart = () => {
    if (customMinutes > 0 && customMinutes <= 180) {
      setSelectedDuration(customMinutes);
      handleStart(customMinutes);
    }
  };

  const progressPct = TimerEngine.getProgressPercentage(focusTimer.secondsRemaining, focusTimer.totalSeconds);
  const formattedTime = TimerEngine.formatTime(focusTimer.secondsRemaining);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>HARDWARE SYNCHRONIZED POMODORO FOCUS</span>
        </div>
        <h1 className="text-3xl font-display font-extrabold text-slate-100">
          Focus Session Engine
        </h1>
        <p className="text-xs text-slate-400 font-mono max-w-lg mx-auto">
          Deep work timer directly controlling the 128x64 OLED display and simulated Green LED indicator
        </p>
      </div>

      {/* Main Glassmorphic Timer Card */}
      <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 border border-slate-800 shadow-2xl relative overflow-hidden flex flex-col items-center justify-center">
        {/* Ambient Ring Glow */}
        <div
          className={`absolute w-[450px] h-[450px] rounded-full blur-3xl pointer-events-none transition-all duration-700 ${
            focusTimer.isRunning && !focusTimer.isPaused
              ? 'bg-emerald-500/10'
              : focusTimer.isPaused
              ? 'bg-amber-500/10'
              : 'bg-teal-500/5'
          }`}
        />

        {/* Subject & Topic Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-6 z-10">
          <span
            className="px-3.5 py-1 rounded-full text-xs font-mono font-bold border"
            style={{
              color: currentSubject?.color || '#2dd4bf',
              backgroundColor: `${currentSubject?.color || '#2dd4bf'}15`,
              borderColor: `${currentSubject?.color || '#2dd4bf'}40`,
            }}
          >
            {currentSubject?.name.toUpperCase()}
          </span>

          <span className="px-3 py-1 rounded-full text-xs font-mono text-slate-300 bg-slate-900 border border-slate-800">
            {selectedTopic}
          </span>

          {hardwareState.ledStudyGreen && (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 flex items-center gap-1.5 animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>GREEN LED: ACTIVE</span>
            </span>
          )}
        </div>

        {/* Giant Digital Stopwatch Display */}
        <div className="relative my-4 z-10 text-center">
          <div className="font-mono text-7xl md:text-9xl font-extrabold tracking-tight text-slate-100 select-none drop-shadow-[0_0_25px_rgba(20,184,166,0.2)]">
            {formattedTime}
          </div>

          <div className="mt-2 text-xs font-mono text-slate-400">
            {focusTimer.isRunning
              ? focusTimer.isPaused
                ? 'SESSION PAUSED — CLICK RESUME'
                : 'FOCUS ACTIVE — HARDWARE IN STUDY MODE'
              : 'READY TO INITIATE'}
          </div>
        </div>

        {/* Linear Progress Bar */}
        <div className="w-full max-w-md h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800 my-4 z-10">
          <div
            className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <div className="text-[11px] font-mono text-slate-500 z-10">
          {progressPct}% Completed
        </div>

        {/* Primary Controls */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-8 z-10">
          {!focusTimer.isRunning ? (
            <button
              onClick={() => handleStart()}
              className="px-8 py-3.5 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-sm shadow-xl shadow-teal-500/30 flex items-center gap-2.5 transition-all active:scale-95"
            >
              <Play className="w-5 h-5 fill-slate-950" />
              <span>START SESSION</span>
            </button>
          ) : focusTimer.isPaused ? (
            <button
              onClick={resumeFocusTimer}
              className="px-8 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm shadow-xl shadow-emerald-500/30 flex items-center gap-2.5 transition-all active:scale-95"
            >
              <Play className="w-5 h-5 fill-slate-950" />
              <span>RESUME</span>
            </button>
          ) : (
            <button
              onClick={pauseFocusTimer}
              className="px-8 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm shadow-xl shadow-amber-500/30 flex items-center gap-2.5 transition-all active:scale-95"
            >
              <Pause className="w-5 h-5 fill-slate-950" />
              <span>PAUSE</span>
            </button>
          )}

          <button
            onClick={resetFocusTimer}
            className="px-5 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-sm font-semibold flex items-center gap-2 transition-all active:scale-95"
            title="Reset timer to beginning"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </button>

          {focusTimer.isRunning && (
            <button
              onClick={() => endFocusSession(true)}
              className="px-5 py-3.5 rounded-2xl bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/40 text-sm font-semibold flex items-center gap-2 transition-all active:scale-95"
              title="Save current progress and finish session"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>End & Log</span>
            </button>
          )}
        </div>
      </div>

      {/* Preset Durations & Subject Selector */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Preset Durations */}
        <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
          <div className="text-xs font-mono text-slate-400 font-semibold uppercase">
            1. Select Session Duration
          </div>
          <div className="grid grid-cols-4 gap-2.5">
            {durationOptions.map((mins) => (
              <button
                key={mins}
                onClick={() => {
                  setSelectedDuration(mins);
                  if (!focusTimer.isRunning) {
                    handleStart(mins);
                  }
                }}
                className={`py-3 rounded-xl font-mono text-sm font-bold border transition-all ${
                  selectedDuration === mins
                    ? 'bg-teal-500/20 border-teal-500 text-teal-300 shadow-md'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                {mins} min
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="number"
              min="5"
              max="180"
              value={customMinutes}
              onChange={(e) => setCustomMinutes(Number(e.target.value))}
              className="w-24 px-3 py-2 text-xs font-mono bg-slate-950 border border-slate-700 rounded-xl text-slate-100 focus:outline-none"
              placeholder="Custom"
            />
            <button
              onClick={handleCustomStart}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono border border-slate-700 transition-all"
            >
              Set Custom Duration
            </button>
          </div>
        </div>

        {/* Target Subject & Topic */}
        <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
          <div className="text-xs font-mono text-slate-400 font-semibold uppercase">
            2. Choose Subject & Focus Topic
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Subject</label>
              <select
                value={selectedSubjectId}
                onChange={(e) => {
                  setSelectedSubjectId(e.target.value);
                  const firstTop = topics.find((t) => t.subjectId === e.target.value);
                  if (firstTop) setSelectedTopic(firstTop.name);
                }}
                disabled={focusTimer.isRunning}
                className="w-full px-3 py-2 text-xs font-mono bg-slate-950 border border-slate-700 rounded-xl text-slate-200 focus:outline-none disabled:opacity-60"
              >
                {subjects.map((sub) => (
                  <option key={sub.id} value={sub.id}>{sub.name} ({sub.code})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Topic</label>
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                disabled={focusTimer.isRunning}
                className="w-full px-3 py-2 text-xs font-mono bg-slate-950 border border-slate-700 rounded-xl text-slate-200 focus:outline-none disabled:opacity-60"
              >
                {subjectTopics.map((top) => (
                  <option key={top.id} value={top.name}>
                    {top.name} ({top.masteryLevel}% mastery)
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
