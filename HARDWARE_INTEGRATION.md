# JARVIS Hardware Integration Guide & Wi-Fi Protocol

This guide outlines the future physical hardware integration plan for transitioning from the **Software Simulator** (`SimulatorHardwareAdapter`) to the physical **ESP32 Microcontroller** (`ESP32HardwareAdapter`) over Wi-Fi.

---

## 1. Hardware Bill of Materials (BOM)

| Component | Specification | Quantity | Purpose |
|---|---|---|---|
| **Microcontroller** | ESP32-WROOM-32D / NodeMCU-32S | 1 | Wi-Fi Client & Display Controller |
| **OLED Display** | 0.96" Monochrome I2C (SSD1306 128x64) | 1 | Micro-display for time, subject & status |
| **LED 1 (Red)** | 5mm Diffused Red LED + 220Ω Resistor | 1 | System Alert / Error Indicator (GPIO 25) |
| **LED 2 (Yellow/Blue)** | 5mm Diffused Amber/Blue LED + 220Ω Resistor | 1 | AI Processing / Cognition Pulse (GPIO 26) |
| **LED 3 (Green)** | 5mm Diffused Green LED + 220Ω Resistor | 1 | Study Session Active Glow (GPIO 27) |
| **Breadboard / PCB** | Half-size solderless breadboard | 1 | Prototyping circuit layout |
| **Jumper Wires** | Male-to-Male / Male-to-Female | 8 | Interconnects |

---

## 2. Wiring & Pinout Diagram

```
                 ESP32-WROOM-32D
             ┌─────────────────────┐
             │       [ANTENNA]     │
             │                     │
      3.3V ──┤ 3V3             GND ├── GND ──┐ (Common Ground)
             │                     │         │
    GPIO21 ──┤ D21 (SDA)       D22 ├── GPIO22 (SCL)
             │                     │         │
    GPIO25 ──┤ D25 (LED Red)   D26 ├── GPIO26 (LED Yellow)
    GPIO27 ──┤ D27 (LED Green)     │         │
             └─────────────────────┘         │
                        │                    │
                        ▼                    ▼
             ┌─────────────────────┐  ┌──────────────┐
             │  SSD1306 OLED (I2C) │  │  STATUS LEDs │
             │  VCC  ── 3.3V       │  │  RED   (D25) │
             │  GND  ── GND        │  │  AMBER (D26) │
             │  SCL  ── GPIO22     │  │  GREEN (D27) │
             │  SDA  ── GPIO21     │  └──────────────┘
             └─────────────────────┘
```

---

## 3. Wi-Fi Communication Protocol

The web application connects to the ESP32 via **WebSocket** for low-latency timer streaming (<20ms) and fallback **HTTP REST** endpoints.

### WebSocket Endpoint: `ws://<ESP32_IP>:8080/ws/stream`

#### A. Study Mode Synchronization Payload
```json
{
  "type": "study_sync",
  "subject": "Physics",
  "topic": "Electrostatics",
  "remaining": 2699,
  "total": 2700,
  "timestamp": 1754652889000
}
```

#### B. AI Processing / Thinking State
```json
{
  "type": "processing",
  "state": "THINKING",
  "timestamp": 1754652892000
}
```

#### C. Direct LED Control
```json
{
  "type": "led_control",
  "led": "STUDY_GREEN",
  "state": true,
  "timestamp": 1754652895000
}
```

#### D. Direct Text Display
```json
{
  "type": "display_text",
  "line1": "   JARVIS AI   ",
  "line2": "----------------",
  "line3": "     ONLINE     ",
  "line4": "     READY      ",
  "timestamp": 1754652899000
}
```

---

## 4. Software Adapter Activation

When the physical hardware is powered on and connected to the same local Wi-Fi network:

1. Open **JARVIS Settings** (`/settings`).
2. Enter the ESP32 local IP address (e.g. `192.168.1.142`).
3. Switch the Hardware Mode from **Software Simulator** to **ESP32 (Wi-Fi)**.
4. The web application seamlessly redirects all OLED frame and LED commands to the microcontroller without restarting the app.
