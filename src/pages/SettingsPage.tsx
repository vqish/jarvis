import React from 'react';
import { useJarvis } from '../state/JarvisContext';
import { 
  Settings as SettingsIcon, 
  Cpu, 
  Moon, 
  Volume2, 
  RotateCcw, 
  Check, 
  VolumeX
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { settings, updateSettings, resetAllData } = useJarvis();

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all demo timetable, task, and notes data back to fresh prototype defaults?')) {
      resetAllData();
    }
  };

  return (
    <div className="max-w-4xl space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-2xl font-display font-bold text-slate-100">System & Assistant Settings</h1>
        <p className="text-xs text-slate-400 font-mono mt-1">
          Configure Jarvis AI identity, Pomodoro timer presets, themes, and Hardware Bridge modes
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. Identity & Study Goals */}
        <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 shadow-md space-y-5">
          <div className="flex items-center gap-2 text-xs font-mono text-teal-400 font-bold uppercase">
            <SettingsIcon className="w-4 h-4" />
            <span>Assistant Personality & Goals</span>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">Jarvis Name / Call-sign</label>
            <input
              type="text"
              value={settings.jarvisName}
              onChange={(e) => updateSettings({ jarvisName: e.target.value })}
              className="w-full px-3 py-2 text-xs font-mono bg-slate-950 border border-slate-700 rounded-xl text-slate-100 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Default Focus (min)</label>
              <select
                value={settings.defaultFocusDuration}
                onChange={(e) => updateSettings({ defaultFocusDuration: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs font-mono bg-slate-950 border border-slate-700 rounded-xl text-slate-100 focus:outline-none"
              >
                <option value={25}>25 min (Pomodoro)</option>
                <option value={45}>45 min (Standard)</option>
                <option value={50}>50 min (University)</option>
                <option value={60}>60 min (Deep Block)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Daily Study Goal (hrs)</label>
              <input
                type="number"
                step="0.5"
                min="1"
                max="12"
                value={settings.dailyGoalHours}
                onChange={(e) => updateSettings({ dailyGoalHours: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs font-mono bg-slate-950 border border-slate-700 rounded-xl text-slate-100 focus:outline-none"
              />
            </div>
          </div>

          {/* Voice Output Toggle */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-800">
            <div>
              <div className="text-xs font-semibold text-slate-200">Voice Synthesis (TTS)</div>
              <div className="text-[11px] text-slate-400">Jarvis speaks study briefings and AI responses aloud</div>
            </div>
            <button
              onClick={() => updateSettings({ voiceOutput: !settings.voiceOutput })}
              className={`p-2 rounded-xl border transition-all ${
                settings.voiceOutput
                  ? 'bg-teal-500/20 text-teal-300 border-teal-500/50'
                  : 'bg-slate-950 text-slate-500 border-slate-800'
              }`}
            >
              {settings.voiceOutput ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* 2. Theme & Visual Appearance */}
        <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 shadow-md space-y-5">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold uppercase">
            <Moon className="w-4 h-4" />
            <span>Theme & Display Engine</span>
          </div>

          <div className="space-y-2.5">
            <label className="block text-xs font-mono text-slate-300">Interface Theme</label>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { id: 'dark', label: 'Dark Mode' },
                { id: 'oled', label: 'OLED Pure Black' },
                { id: 'light', label: 'Clean Light' },
              ].map((th) => (
                <button
                  key={th.id}
                  onClick={() => updateSettings({ theme: th.id as any })}
                  className={`py-3 px-2 rounded-xl text-xs font-mono font-semibold border transition-all ${
                    settings.theme === th.id
                      ? 'bg-teal-500/20 border-teal-500 text-teal-300 shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {th.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-400 space-y-1">
            <div className="text-teal-400 font-semibold">OLED Contrast Calibration</div>
            <p className="text-[11px] leading-relaxed">
              Monochrome high-contrast matrix designed for high focus and reduced ocular fatigue during late-night revision sessions.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Hardware Adapter Configuration (SIMULATOR vs ESP32) */}
      <div className="p-6 md:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-slate-100">
                Hardware Layer & Microcontroller Bridge
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Decoupled adapter architecture supporting Software Simulator and future Wi-Fi ESP32
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Option A: Simulator */}
          <div
            onClick={() => updateSettings({ hardwareMode: 'SIMULATOR' })}
            className={`p-5 rounded-2xl border cursor-pointer transition-all ${
              settings.hardwareMode === 'SIMULATOR'
                ? 'bg-teal-950/40 border-teal-500 text-teal-100 shadow-lg shadow-teal-500/10'
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs font-bold text-teal-300">
                1. SOFTWARE SIMULATOR (ACTIVE)
              </span>
              {settings.hardwareMode === 'SIMULATOR' && (
                <Check className="w-4 h-4 text-teal-400" />
              )}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Emulates a 128x64 I2C monochrome OLED display and 3 LED status indicators (Red, Yellow, Green) directly in software. No physical hardware required.
            </p>
          </div>

          {/* Option B: ESP32 Wi-Fi (Future) */}
          <div
            onClick={() => updateSettings({ hardwareMode: 'ESP32_WIFI' })}
            className={`p-5 rounded-2xl border cursor-pointer transition-all ${
              settings.hardwareMode === 'ESP32_WIFI'
                ? 'bg-amber-950/40 border-amber-500 text-amber-100 shadow-lg shadow-amber-500/10'
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs font-bold text-amber-300">
                2. ESP32 — NOT CONNECTED (FUTURE WI-FI)
              </span>
              {settings.hardwareMode === 'ESP32_WIFI' && (
                <Check className="w-4 h-4 text-amber-400" />
              )}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Streams timer, status, and display payloads over WebSocket / HTTP REST to physical ESP32-WROOM-32 hardware over local Wi-Fi.
            </p>
            <div className="mt-3 text-[10px] font-mono text-amber-400/80">
              IP: {settings.esp32IpAddress} • Port: {settings.esp32Port}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Prototype Data Reset */}
      <div className="p-6 rounded-3xl bg-red-950/20 border border-red-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-mono font-bold text-red-300">Reset Local Demonstration Data</div>
          <div className="text-xs text-slate-400 mt-0.5">
            Restores initial timetable, problem sets, exam dates, and notes to clean demonstration defaults.
          </div>
        </div>

        <button
          onClick={handleReset}
          className="px-4 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-200 border border-red-500/40 text-xs font-mono font-semibold flex items-center gap-1.5 transition-all self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset to Defaults</span>
        </button>
      </div>
    </div>
  );
};
