import { HardwareAdapter, DisplayFrame } from './types';
import { HardwareState, SystemState } from '../../types';

export class SimulatorHardwareAdapter implements HardwareAdapter {
  private state: HardwareState;
  private listeners: Set<(state: HardwareState) => void> = new Set();
  private pulseTimer: any = null;

  constructor() {
    this.state = {
      systemStatus: 'IDLE',
      oledText: {
        line1: '   JARVIS v1.0   ',
        line2: '------------------',
        line3: '     ONLINE       ',
        line4: '  READY TO STUDY  ',
      },
      oledMode: 'READY',
      ledSystemRed: false,
      ledAiProcessingYellow: false,
      ledStudyGreen: false,
      connected: true,
      simulatedDeviceName: 'ESP32-WROOM-32 (SIMULATED)',
      firmwareVersion: 'v2.4.1-STUDY-CORE',
      lastSyncTimestamp: Date.now(),
    };
  }

  async initialize(): Promise<boolean> {
    this.setOLEDScreen('BOOT', {
      line1: '   JARVIS AI   ',
      line2: 'INITIALIZING...',
      line3: 'CALIBRATING CORE',
      line4: 'STUDY ENGINE OK',
    });
    this.setLEDState('SYSTEM_RED', true);
    this.setLEDState('AI_YELLOW', 'PULSE');
    this.setLEDState('STUDY_GREEN', false);

    await new Promise((resolve) => setTimeout(resolve, 800));

    this.state.systemStatus = 'IDLE';
    this.setOLEDScreen('READY', {
      line1: '     JARVIS      ',
      line2: '------------------',
      line3: '     ONLINE       ',
      line4: '      READY       ',
    });
    this.setLEDState('SYSTEM_RED', false);
    this.setLEDState('AI_YELLOW', false);
    this.setLEDState('STUDY_GREEN', false);
    this.emitChange();
    return true;
  }

  setOLEDText(line1: string, line2 = '', line3 = '', line4 = ''): void {
    this.state.oledText = {
      line1: line1.padEnd(18, ' ').slice(0, 18),
      line2: line2.padEnd(18, ' ').slice(0, 18),
      line3: line3.padEnd(18, ' ').slice(0, 18),
      line4: line4.padEnd(18, ' ').slice(0, 18),
    };
    this.state.lastSyncTimestamp = Date.now();
    this.emitChange();
  }

  setOLEDScreen(
    mode: 'BOOT' | 'READY' | 'STUDY' | 'THINKING' | 'MESSAGE' | 'COMPLETED' | 'PAUSED' | 'OFFLINE',
    frameData?: Partial<DisplayFrame>
  ): void {
    this.state.oledMode = mode;

    switch (mode) {
      case 'BOOT':
        this.setOLEDText(
          frameData?.line1 || '     JARVIS     ',
          frameData?.line2 || ' INITIALIZING...',
          frameData?.line3 || ' SENSORS: ONLINE',
          frameData?.line4 || ' OLED 128x64 OK '
        );
        break;

      case 'READY':
        this.setOLEDText(
          frameData?.line1 || '     JARVIS     ',
          frameData?.line2 || '----------------',
          frameData?.line3 || '     ONLINE     ',
          frameData?.line4 || '     READY      '
        );
        break;

      case 'THINKING':
        this.setOLEDText(
          frameData?.line1 || '     JARVIS     ',
          frameData?.line2 || '  THINKING...   ',
          frameData?.line3 || ' PROCESSING ACT ',
          frameData?.line4 || '................'
        );
        break;

      case 'STUDY':
        this.setOLEDText(
          frameData?.line1 || '   STUDY MODE   ',
          frameData?.line2 || '----------------',
          frameData?.line3 || ' PHYSICS FOCUS  ',
          frameData?.line4 || '     25:00      '
        );
        break;

      case 'PAUSED':
        this.setOLEDText(
          frameData?.line1 || '  STUDY PAUSED  ',
          frameData?.line2 || '----------------',
          frameData?.line3 || ' CLICK TO RESUME',
          frameData?.line4 || '     PAUSED     '
        );
        break;

      case 'COMPLETED':
        this.setOLEDText(
          frameData?.line1 || 'SESSION COMPLETE',
          frameData?.line2 || '----------------',
          frameData?.line3 || ' EXCELLENT WORK ',
          frameData?.line4 || '  +SESSION LOG  '
        );
        break;

      case 'OFFLINE':
        this.setOLEDText('  JARVIS SLEEP  ', '----------------', '  SYSTEM HALT   ', '  STANDBY MODE  ');
        break;

      case 'MESSAGE':
      default:
        if (frameData) {
          this.setOLEDText(
            frameData.line1 || '',
            frameData.line2 || '',
            frameData.line3 || '',
            frameData.line4 || ''
          );
        }
        break;
    }
  }

  setLEDState(
    led: 'SYSTEM_RED' | 'AI_YELLOW' | 'STUDY_GREEN',
    state: boolean | 'BLINK' | 'PULSE'
  ): void {
    if (led === 'SYSTEM_RED') {
      this.state.ledSystemRed = Boolean(state);
    } else if (led === 'AI_YELLOW') {
      this.state.ledAiProcessingYellow = state;
    } else if (led === 'STUDY_GREEN') {
      this.state.ledStudyGreen = Boolean(state);
    }
    this.state.lastSyncTimestamp = Date.now();
    this.emitChange();
  }

  setSystemState(state: SystemState): void {
    this.state.systemStatus = state;

    switch (state) {
      case 'IDLE':
        this.setOLEDScreen('READY');
        this.setLEDState('SYSTEM_RED', false);
        this.setLEDState('AI_YELLOW', false);
        this.setLEDState('STUDY_GREEN', false);
        break;

      case 'THINKING':
      case 'LISTENING':
        this.setOLEDScreen('THINKING');
        this.setLEDState('AI_YELLOW', 'PULSE');
        this.setLEDState('SYSTEM_RED', false);
        break;

      case 'RESPONDING':
        this.setLEDState('AI_YELLOW', true);
        break;

      case 'STUDYING':
        this.setLEDState('STUDY_GREEN', true);
        this.setLEDState('AI_YELLOW', false);
        this.setLEDState('SYSTEM_RED', false);
        break;

      case 'PAUSED':
        this.setOLEDScreen('PAUSED');
        this.setLEDState('STUDY_GREEN', 'BLINK');
        break;

      case 'COMPLETED':
        this.setOLEDScreen('COMPLETED');
        this.setLEDState('STUDY_GREEN', true);
        this.setLEDState('AI_YELLOW', false);
        break;

      case 'ERROR':
        this.setLEDState('SYSTEM_RED', 'BLINK');
        this.setLEDState('AI_YELLOW', false);
        this.setOLEDText('  SYSTEM ERROR  ', '----------------', ' CHECK CONSOLE  ', ' RETRY COMMAND  ');
        break;

      case 'OFFLINE':
        this.setOLEDScreen('OFFLINE');
        this.setLEDState('SYSTEM_RED', false);
        this.setLEDState('AI_YELLOW', false);
        this.setLEDState('STUDY_GREEN', false);
        break;
    }
    this.emitChange();
  }

  setStudyState(
    subject: string,
    topic: string,
    remainingSeconds: number,
    totalSeconds: number
  ): void {
    const mins = Math.floor(remainingSeconds / 60);
    const secs = remainingSeconds % 60;
    const timeStr = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

    this.state.studyProgress = {
      subject,
      topic,
      secondsRemaining: remainingSeconds,
      totalSeconds,
    };
    this.state.oledMode = 'STUDY';
    this.state.systemStatus = 'STUDYING';
    this.setLEDState('STUDY_GREEN', true);
    this.setLEDState('AI_YELLOW', false);
    this.setLEDState('SYSTEM_RED', false);

    // Shorten subject and topic to fit neatly on 18-char 128x64 display
    const cleanSub = subject.toUpperCase().slice(0, 16).padStart((18 + subject.length) / 2, ' ').slice(0, 18);
    const cleanTopic = topic.slice(0, 16).padStart((18 + topic.length) / 2, ' ').slice(0, 18);
    const cleanTime = `     ${timeStr}      `.slice(0, 18);

    this.state.oledText = {
      line1: '   STUDY MODE   ',
      line2: cleanSub,
      line3: cleanTopic,
      line4: cleanTime,
    };

    this.state.lastSyncTimestamp = Date.now();
    this.emitChange();
  }

  setProcessingState(isProcessing: boolean): void {
    if (isProcessing) {
      this.state.systemStatus = 'THINKING';
      this.setLEDState('AI_YELLOW', 'PULSE');
      this.setOLEDScreen('THINKING');
    } else {
      if (this.state.systemStatus === 'THINKING') {
        this.setSystemState('IDLE');
      }
    }
  }

  clearDisplay(): void {
    this.state.oledText = {
      line1: '                  ',
      line2: '                  ',
      line3: '                  ',
      line4: '                  ',
    };
    this.emitChange();
  }

  getHardwareState(): HardwareState {
    return { ...this.state };
  }

  onStateChange(listener: (state: HardwareState) => void): () => void {
    this.listeners.add(listener);
    listener(this.getHardwareState());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private emitChange(): void {
    const snapshot = this.getHardwareState();
    this.listeners.forEach((listener) => listener(snapshot));
  }
}
