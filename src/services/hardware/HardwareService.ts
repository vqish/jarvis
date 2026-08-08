import { HardwareAdapter } from './types';
import { SimulatorHardwareAdapter } from './SimulatorHardwareAdapter';
import { ESP32HardwareAdapter } from './ESP32HardwareAdapter';
import { HardwareState, SystemState } from '../../types';

class HardwareServiceImpl {
  private adapter: HardwareAdapter;
  private mode: 'SIMULATOR' | 'ESP32_WIFI' = 'SIMULATOR';

  constructor() {
    this.adapter = new SimulatorHardwareAdapter();
    this.adapter.initialize();
  }

  setMode(mode: 'SIMULATOR' | 'ESP32_WIFI', esp32Ip?: string, esp32Port?: number): void {
    this.mode = mode;
    if (mode === 'SIMULATOR') {
      this.adapter = new SimulatorHardwareAdapter();
    } else {
      this.adapter = new ESP32HardwareAdapter(esp32Ip || '192.168.1.142', esp32Port || 8080);
    }
    this.adapter.initialize();
  }

  getMode(): 'SIMULATOR' | 'ESP32_WIFI' {
    return this.mode;
  }

  getAdapter(): HardwareAdapter {
    return this.adapter;
  }

  setSystemState(state: SystemState): void {
    this.adapter.setSystemState(state);
  }

  setStudyState(subject: string, topic: string, remainingSeconds: number, totalSeconds: number): void {
    this.adapter.setStudyState(subject, topic, remainingSeconds, totalSeconds);
  }

  setProcessing(isProcessing: boolean): void {
    this.adapter.setProcessingState(isProcessing);
  }

  setOLEDText(line1: string, line2?: string, line3?: string, line4?: string): void {
    this.adapter.setOLEDText(line1, line2, line3, line4);
  }

  setLED(led: 'SYSTEM_RED' | 'AI_YELLOW' | 'STUDY_GREEN', state: boolean | 'BLINK' | 'PULSE'): void {
    this.adapter.setLEDState(led, state);
  }

  getHardwareState(): HardwareState {
    return this.adapter.getHardwareState();
  }

  onStateChange(listener: (state: HardwareState) => void): () => void {
    return this.adapter.onStateChange(listener);
  }
}

export const HardwareService = new HardwareServiceImpl();
