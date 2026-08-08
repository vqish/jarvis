import { SystemState, HardwareState } from '../../types';

export interface DisplayFrame {
  line1: string;
  line2: string;
  line3: string;
  line4: string;
  graphic?: 'LOGO' | 'BRAIN' | 'HOURGLASS' | 'CHECK' | 'ALERT' | 'WIFI' | 'ATOM';
  progressPercent?: number;
}

export interface HardwareAdapter {
  /** Initialize connection to the hardware device or simulator */
  initialize(): Promise<boolean>;

  /** Direct text writing to 128x64 display (4 lines max) */
  setOLEDText(line1: string, line2?: string, line3?: string, line4?: string): void;

  /** Set high-level screen mode (BOOT, READY, STUDY, THINKING, etc.) */
  setOLEDScreen(
    mode: 'BOOT' | 'READY' | 'STUDY' | 'THINKING' | 'MESSAGE' | 'COMPLETED' | 'PAUSED' | 'OFFLINE',
    frameData?: Partial<DisplayFrame>
  ): void;

  /** Control physical/simulated LEDs */
  setLEDState(
    led: 'SYSTEM_RED' | 'AI_YELLOW' | 'STUDY_GREEN',
    state: boolean | 'BLINK' | 'PULSE'
  ): void;

  /** Update overall assistant system state */
  setSystemState(state: SystemState): void;

  /** Update active study countdown on OLED and activate Green LED */
  setStudyState(
    subject: string,
    topic: string,
    remainingSeconds: number,
    totalSeconds: number
  ): void;

  /** Indicate AI is processing a prompt or executing tool */
  setProcessingState(isProcessing: boolean): void;

  /** Clear OLED display */
  clearDisplay(): void;

  /** Retrieve latest hardware state snapshot */
  getHardwareState(): HardwareState;

  /** Subscribe to state updates */
  onStateChange(listener: (state: HardwareState) => void): () => void;
}
