import React, { useEffect, useRef } from 'react';
import { HardwareState } from '../../types';

interface OLEDCanvasProps {
  hardwareState: HardwareState;
  width?: number;
  height?: number;
}

export const OLEDCanvas: React.FC<OLEDCanvasProps> = ({
  hardwareState,
  width = 280,
  height = 140,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frame = 0;

    const render = () => {
      frame++;
      ctx.fillStyle = '#04080e';
      ctx.fillRect(0, 0, width, height);

      // Draw subtle OLED pixel grid lines
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.04)';
      ctx.lineWidth = 1;
      for (let y = 0; y < height; y += 4) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      ctx.fillStyle = '#00f0ff';
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 6;

      const mode = hardwareState.oledMode;

      if (mode === 'STUDY' && hardwareState.studyProgress) {
        const { subject, topic, secondsRemaining, totalSeconds } = hardwareState.studyProgress;
        const mins = Math.floor(secondsRemaining / 60);
        const secs = secondsRemaining % 60;
        const timeStr = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        const pct = totalSeconds > 0 ? (totalSeconds - secondsRemaining) / totalSeconds : 0;

        // Header
        ctx.font = '10px "Press Start 2P", monospace';
        ctx.fillStyle = '#38bdf8';
        ctx.fillText('■ STUDY MODE ■', 16, 22);

        // Subject & Topic
        ctx.font = '9px "Press Start 2P", monospace';
        ctx.fillStyle = '#e0f2fe';
        ctx.fillText(subject.toUpperCase().slice(0, 16), 16, 42);

        ctx.font = '7px "Press Start 2P", monospace';
        ctx.fillStyle = '#7dd3fc';
        ctx.fillText(topic.slice(0, 24), 16, 58);

        // Huge pixel timer
        ctx.font = '22px "Press Start 2P", monospace';
        ctx.fillStyle = '#00f0ff';
        ctx.shadowBlur = 10;
        ctx.fillText(timeStr, 40, 92);

        // Progress bar (pixel blocks)
        ctx.shadowBlur = 0;
        ctx.strokeStyle = '#0284c7';
        ctx.strokeRect(16, 108, width - 32, 12);

        const barWidth = Math.max(4, Math.floor((width - 36) * pct));
        ctx.fillStyle = '#00f0ff';
        ctx.fillRect(18, 110, barWidth, 8);
      } else if (mode === 'THINKING') {
        ctx.font = '10px "Press Start 2P", monospace';
        ctx.fillStyle = '#ffb703';
        ctx.shadowColor = '#ffb703';
        ctx.shadowBlur = 8;
        ctx.fillText('>> JARVIS AI <<', 24, 26);

        // Animated rotating radar / pulse glyph
        const angle = (frame * 0.08) % (Math.PI * 2);
        const cx = width / 2;
        const cy = 64;
        const radius = 18;

        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 183, 3, 0.4)';
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius);
        ctx.strokeStyle = '#ffb703';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.font = '8px "Press Start 2P", monospace';
        ctx.fillStyle = '#fef08a';
        ctx.shadowBlur = 4;
        ctx.fillText('PROCESSING INTENT', 20, 106);
        ctx.fillText('TOOLS RUNNING...', 34, 122);
      } else if (mode === 'COMPLETED') {
        ctx.font = '10px "Press Start 2P", monospace';
        ctx.fillStyle = '#10b981';
        ctx.shadowColor = '#10b981';
        ctx.shadowBlur = 8;
        ctx.fillText('★ SESSION COMPLETE ★', 12, 28);

        ctx.font = '8px "Press Start 2P", monospace';
        ctx.fillStyle = '#ecfdf5';
        ctx.fillText('FOCUS TIME LOGGED', 28, 58);
        ctx.fillText('+45 MIN RECORDED', 30, 78);
        ctx.fillText('MASTERY LEVEL UP', 32, 98);

        ctx.fillStyle = '#34d399';
        ctx.fillText('READY FOR NEXT', 42, 122);
      } else if (mode === 'PAUSED') {
        ctx.font = '11px "Press Start 2P", monospace';
        ctx.fillStyle = '#f59e0b';
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 6;
        ctx.fillText('** PAUSED **', 38, 38);

        ctx.font = '8px "Press Start 2P", monospace';
        ctx.fillStyle = '#fef3c7';
        ctx.fillText('TIMER HALTED', 48, 68);
        ctx.fillText('CLICK RESUME IN UI', 18, 98);
      } else if (mode === 'OFFLINE') {
        ctx.font = '10px "Press Start 2P", monospace';
        ctx.fillStyle = '#ef4444';
        ctx.shadowColor = '#ef4444';
        ctx.shadowBlur = 6;
        ctx.fillText('STANDBY / OFFLINE', 18, 50);

        ctx.font = '7px "Press Start 2P", monospace';
        ctx.fillStyle = '#fca5a5';
        ctx.fillText('HARDWARE ADAPTER OFF', 22, 80);
        ctx.fillText('SIMULATOR READY', 40, 105);
      } else {
        // Default text frame
        const { line1, line2, line3, line4 } = hardwareState.oledText;
        ctx.font = '9px "Press Start 2P", monospace';
        ctx.fillStyle = '#00f0ff';
        ctx.fillText(line1, 14, 28);
        ctx.fillText(line2, 14, 56);
        ctx.fillText(line3, 14, 84);
        ctx.fillText(line4, 14, 112);
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [hardwareState, width, height]);

  return (
    <div className="oled-screen-bezel p-2 bg-[#080d14] inline-block shadow-2xl">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="block rounded bg-[#04080e] shadow-inner"
      />
    </div>
  );
};
