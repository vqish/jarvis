import React from 'react';
import { useJarvis } from '../../state/JarvisContext';
import { OLEDCanvas } from './OLEDCanvas';
import { LEDIndicator } from './LEDIndicator';
import { HardwareService } from '../../services/hardware/HardwareService';
import { Cpu, Wifi, RefreshCw, Play, Sparkles, Terminal, Activity, Radio } from 'lucide-react';

interface HardwareSimulatorProps {
  compact?: boolean;
}

export const HardwareSimulator: React.FC<HardwareSimulatorProps> = ({ compact = false }) => {
  const { hardwareState, startFocusTimer, setSystemState, settings, updateSettings } = useJarvis();

  const handleReboot = async () => {
    const adapter = HardwareService.getAdapter();
    await adapter.initialize();
  };

  const handleTestAI = () => {
    HardwareService.setProcessing(true);
    setTimeout(() => {
      HardwareService.setProcessing(false);
    }, 2500);
  };

  const handleQuickStudy = () => {
    startFocusTimer(25, 'sub-phys', 'Electrostatics & Coulomb Law');
  };

  const handleToggleHardwareMode = () => {
    const nextMode = settings.hardwareMode === 'SIMULATOR' ? 'ESP32_WIFI' : 'SIMULATOR';
    updateSettings({ hardwareMode: nextMode });
  };

  return (
    <div className="bg-gradient-to-b from-slate-900 via-slate-950 to-black rounded-2xl border border-slate-700/80 shadow-2xl p-5 relative overflow-hidden">
      {/* Decorative PCB Corner Mount Screws */}
      <div className="absolute top-2.5 left-2.5 w-3 h-3 rounded-full bg-slate-600 border border-slate-400 flex items-center justify-center shadow-inner">
        <div className="w-1.5 h-0.5 bg-slate-900 rotate-45" />
      </div>
      <div className="absolute top-2.5 right-2.5 w-3 h-3 rounded-full bg-slate-600 border border-slate-400 flex items-center justify-center shadow-inner">
        <div className="w-1.5 h-0.5 bg-slate-900 -rotate-45" />
      </div>
      <div className="absolute bottom-2.5 left-2.5 w-3 h-3 rounded-full bg-slate-600 border border-slate-400 flex items-center justify-center shadow-inner">
        <div className="w-1.5 h-0.5 bg-slate-900 -rotate-45" />
      </div>
      <div className="absolute bottom-2.5 right-2.5 w-3 h-3 rounded-full bg-slate-600 border border-slate-400 flex items-center justify-center shadow-inner">
        <div className="w-1.5 h-0.5 bg-slate-900 rotate-45" />
      </div>

      {/* PCB Header & Identification */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4 px-2">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-teal-500/10 border border-teal-500/30 text-teal-400">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-slate-100 tracking-wider">
                JARVIS HARDWARE SIMULATOR
              </span>
              <span className="px-1.5 py-0.5 text-[9px] font-mono rounded bg-teal-900/60 text-teal-300 border border-teal-700/50">
                REV 2.4
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono flex items-center gap-2">
              <span>MCU: ESP32-WROOM-32D</span>
              <span>•</span>
              <span className="text-teal-400">128x64 OLED (I2C 0x3C)</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleToggleHardwareMode}
          title="Toggle between Software Simulator and ESP32 Wi-Fi bridge"
          className={`px-2.5 py-1 text-[10px] font-mono rounded-lg border transition-all flex items-center gap-1.5 ${
            settings.hardwareMode === 'SIMULATOR'
              ? 'bg-teal-950/60 border-teal-600/60 text-teal-300 hover:bg-teal-900/60'
              : 'bg-amber-950/60 border-amber-600/60 text-amber-300 hover:bg-amber-900/60'
          }`}
        >
          <Radio className="w-3 h-3 animate-pulse" />
          {settings.hardwareMode === 'SIMULATOR' ? 'MODE: SIMULATOR' : 'MODE: ESP32 BRIDGE'}
        </button>
      </div>

      {/* Main Electronics Canvas Area */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center bg-slate-900/60 rounded-xl p-4 border border-slate-800">
        {/* Left/Top: 128x64 Monochrome OLED Bezel */}
        <div className="md:col-span-7 flex flex-col items-center justify-center">
          <div className="text-[10px] font-mono text-slate-400 mb-1 flex items-center gap-1.5">
            <Activity className="w-3 h-3 text-cyan-400" />
            <span>0.96" I2C OLED DISPLAY (SSD1306)</span>
          </div>
          <OLEDCanvas hardwareState={hardwareState} width={compact ? 240 : 280} height={compact ? 120 : 138} />
          <div className="text-[9px] font-mono text-slate-400 mt-1.5 flex items-center justify-between w-full px-2">
            <span>SDA: GPIO21</span>
            <span className="text-cyan-400">FRAME SYNC: 60 FPS</span>
            <span>SCL: GPIO22</span>
          </div>
        </div>

        {/* Right/Bottom: 3 Physical LED Status Diodes & ESP32 Chip Graphic */}
        <div className="md:col-span-5 flex flex-col items-center justify-between gap-4">
          {/* LED Strip */}
          <div className="w-full bg-slate-950/80 rounded-xl p-3 border border-slate-800 flex items-center justify-around shadow-inner">
            <LEDIndicator
              color="red"
              state={hardwareState.ledSystemRed}
              label="SYS / ALERT"
              subLabel="GPIO 25"
            />
            <div className="w-px h-8 bg-slate-800" />
            <LEDIndicator
              color="yellow"
              state={hardwareState.ledAiProcessingYellow}
              label="AI PROCESS"
              subLabel="GPIO 26"
            />
            <div className="w-px h-8 bg-slate-800" />
            <LEDIndicator
              color="green"
              state={hardwareState.ledStudyGreen}
              label="STUDY ON"
              subLabel="GPIO 27"
            />
          </div>

          {/* Microcontroller Silkscreen Badge */}
          <div className="w-full bg-slate-800/40 border border-slate-700/60 rounded-lg p-2.5 font-mono text-[10px] text-slate-300">
            <div className="flex items-center justify-between text-slate-400 mb-1 border-b border-slate-700/50 pb-1">
              <span className="flex items-center gap-1 text-slate-200">
                <Wifi className="w-3 h-3 text-teal-400" />
                {settings.hardwareMode === 'SIMULATOR' ? 'LOOPBACK (LOCAL)' : settings.esp32IpAddress}
              </span>
              <span className="text-teal-400 font-semibold">
                {hardwareState.connected ? 'ONLINE' : 'STANDBY'}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-1 text-[9px] text-slate-400">
              <div>FLASH: 4MB SPI</div>
              <div>RAM: 520KB SRAM</div>
              <div>BAUD: 115200</div>
              <div>STATUS: {hardwareState.systemStatus}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Simulator Interactive Hardware Buttons */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={handleReboot}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs border border-slate-600/70 flex items-center gap-1.5 transition-all shadow active:scale-95"
            title="Reset simulated ESP32 & OLED"
          >
            <RefreshCw className="w-3 h-3 text-cyan-400" />
            RST / REBOOT
          </button>

          <button
            onClick={handleTestAI}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs border border-slate-600/70 flex items-center gap-1.5 transition-all shadow active:scale-95"
            title="Simulate yellow LED pulse & AI thinking animation"
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            TEST AI
          </button>

          <button
            onClick={handleQuickStudy}
            className="px-3 py-1.5 rounded-lg bg-teal-950/70 hover:bg-teal-900 text-teal-200 font-mono text-xs border border-teal-600/70 flex items-center gap-1.5 transition-all shadow active:scale-95"
            title="Trigger 25-min study timer & green LED"
          >
            <Play className="w-3 h-3 text-teal-400" />
            STUDY 25M
          </button>
        </div>

        <div className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
          <Terminal className="w-3 h-3 text-slate-400" />
          <span>REALTIME SYNCHRONIZED</span>
        </div>
      </div>
    </div>
  );
};
