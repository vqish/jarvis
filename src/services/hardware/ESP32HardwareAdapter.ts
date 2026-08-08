import { HardwareAdapter, DisplayFrame } from './types';
import { HardwareState, SystemState } from '../../types';

/**
 * ESP32HardwareAdapter (Future Hardware Bridge)
 * 
 * Designed to connect to a physical ESP32-WROOM-32 microcontroller over Wi-Fi
 * using WebSocket for low-latency timer streaming (<20ms) and HTTP REST for status frames.
 * 
 * Target ESP32 Pinout & Specs:
 * - SSD1306 0.96" I2C 128x64 OLED (SDA: GPIO 21, SCL: GPIO 22, Address 0x3C)
 * - LED 1 (Red / System Alert): GPIO 25
 * - LED 2 (Yellow / AI Processing): GPIO 26
 * - LED 3 (Green / Study Active): GPIO 27
 */
export class ESP32HardwareAdapter implements HardwareAdapter {
  private ipAddress: string;
  private port: number;
  private isConnected = false;
  private ws: WebSocket | null = null;
  private fallbackSimulatorState: HardwareState;
  private listeners: Set<(state: HardwareState) => void> = new Set();

  constructor(ipAddress = '192.168.1.142', port = 8080) {
    this.ipAddress = ipAddress;
    this.port = port;
    this.fallbackSimulatorState = {
      systemStatus: 'OFFLINE',
      oledText: {
        line1: ' ESP32 DISCONNECT ',
        line2: '------------------',
        line3: ` IP: ${ipAddress}  `,
        line4: ' CHECK WI-FI / MCU ',
      },
      oledMode: 'OFFLINE',
      ledSystemRed: true,
      ledAiProcessingYellow: false,
      ledStudyGreen: false,
      connected: false,
      simulatedDeviceName: `ESP32-HARDWARE (${ipAddress})`,
      firmwareVersion: 'v2.4.1-PENDING-SYNC',
      lastSyncTimestamp: Date.now(),
    };
  }

  async initialize(): Promise<boolean> {
    console.info(`[ESP32Adapter] Attempting Wi-Fi handshake at ws://${this.ipAddress}:${this.port}/ws/stream`);
    try {
      if (typeof window !== 'undefined' && 'WebSocket' in window) {
        // Attempt connect with short timeout
        // In this software prototype phase, it gracefully reports not connected
        this.fallbackSimulatorState.connected = false;
        this.fallbackSimulatorState.systemStatus = 'OFFLINE';
      }
    } catch (err) {
      console.warn('[ESP32Adapter] Physical ESP32 not detected on local network. Will require hardware sync.', err);
    }
    this.emitChange();
    return false;
  }

  setOLEDText(line1: string, line2 = '', line3 = '', line4 = ''): void {
    this.sendPayload({
      type: 'display_text',
      line1,
      line2,
      line3,
      line4,
      timestamp: Date.now(),
    });
  }

  setOLEDScreen(
    mode: 'BOOT' | 'READY' | 'STUDY' | 'THINKING' | 'MESSAGE' | 'COMPLETED' | 'PAUSED' | 'OFFLINE',
    frameData?: Partial<DisplayFrame>
  ): void {
    this.sendPayload({
      type: 'display_screen',
      screen: mode,
      frame: frameData,
      timestamp: Date.now(),
    });
  }

  setLEDState(
    led: 'SYSTEM_RED' | 'AI_YELLOW' | 'STUDY_GREEN',
    state: boolean | 'BLINK' | 'PULSE'
  ): void {
    this.sendPayload({
      type: 'led_control',
      led,
      state,
      timestamp: Date.now(),
    });
  }

  setSystemState(state: SystemState): void {
    this.sendPayload({
      type: 'system_state',
      state,
      timestamp: Date.now(),
    });
  }

  setStudyState(
    subject: string,
    topic: string,
    remainingSeconds: number,
    totalSeconds: number
  ): void {
    this.sendPayload({
      type: 'study_sync',
      subject,
      topic,
      remaining: remainingSeconds,
      total: totalSeconds,
      timestamp: Date.now(),
    });
  }

  setProcessingState(isProcessing: boolean): void {
    this.sendPayload({
      type: 'processing',
      state: isProcessing ? 'THINKING' : 'IDLE',
      timestamp: Date.now(),
    });
  }

  clearDisplay(): void {
    this.sendPayload({
      type: 'clear',
      timestamp: Date.now(),
    });
  }

  getHardwareState(): HardwareState {
    return { ...this.fallbackSimulatorState };
  }

  onStateChange(listener: (state: HardwareState) => void): () => void {
    this.listeners.add(listener);
    listener(this.getHardwareState());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private sendPayload(payload: any): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(payload));
    }
  }

  private emitChange(): void {
    const snapshot = this.getHardwareState();
    this.listeners.forEach((listener) => listener(snapshot));
  }
}
