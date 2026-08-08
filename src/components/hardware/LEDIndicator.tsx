import React from 'react';

interface LEDIndicatorProps {
  color: 'red' | 'yellow' | 'blue' | 'green';
  state: boolean | 'BLINK' | 'PULSE';
  label: string;
  subLabel?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const LEDIndicator: React.FC<LEDIndicatorProps> = ({
  color,
  state,
  label,
  subLabel,
  size = 'md',
}) => {
  const isOn = Boolean(state);
  const isBlink = state === 'BLINK';
  const isPulse = state === 'PULSE';

  const sizeClasses = {
    sm: 'w-2.5 h-2.5',
    md: 'w-3.5 h-3.5',
    lg: 'w-4.5 h-4.5',
  }[size];

  const getGlowClass = () => {
    if (!isOn) return 'bg-slate-800 border-slate-700/60 shadow-inner opacity-40';

    switch (color) {
      case 'red':
        return 'bg-red-500 border-red-300 shadow-[0_0_12px_#ef4444,0_0_24px_rgba(239,68,68,0.7)]';
      case 'yellow':
        return 'bg-amber-400 border-amber-200 shadow-[0_0_12px_#f59e0b,0_0_24px_rgba(245,158,11,0.7)]';
      case 'blue':
        return 'bg-sky-400 border-sky-200 shadow-[0_0_12px_#38bdf8,0_0_24px_rgba(56,189,248,0.8)]';
      case 'green':
        return 'bg-emerald-400 border-emerald-200 shadow-[0_0_14px_#10b981,0_0_28px_rgba(16,185,129,0.85)]';
    }
  };

  return (
    <div className="flex flex-col items-center gap-1.5 select-none">
      <div className="relative flex items-center justify-center">
        {/* Outer metallic LED bezel socket */}
        <div className="p-1 rounded-full bg-gradient-to-b from-slate-700 via-slate-900 to-slate-950 border border-slate-600 shadow-md">
          {/* Internal LED Diode */}
          <div
            className={`rounded-full border transition-all duration-300 ${sizeClasses} ${getGlowClass()} ${
              isBlink ? 'animate-ping' : ''
            } ${isPulse ? 'animate-pulse' : ''}`}
          />
        </div>
      </div>
      <span className="text-[10px] font-mono tracking-wider font-semibold uppercase text-slate-300">
        {label}
      </span>
      {subLabel && (
        <span className="text-[8px] font-mono text-slate-400 -mt-1">
          {subLabel}
        </span>
      )}
    </div>
  );
};
