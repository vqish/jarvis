# JARVIS Development Roadmap

This document outlines the step-by-step roadmap for taking the JARVIS AI Study Assistant from the current Software Prototype to full physical hardware deployment and cloud integration.

---

## 📍 Phase 1: Software Prototype (COMPLETED ✅)
- [x] Modern desktop dashboard with dark/OLED themes.
- [x] Modular state management and repository persistence (`StorageService`).
- [x] Authentic 128x64 monochrome OLED pixel-matrix simulator.
- [x] Realistic 3-LED status indicator system (Red, Yellow, Green).
- [x] AI chat with natural language intent recognition and tool calling.
- [x] Full study modules: Today's Plan, Timetable, Tasks, Focus Pomodoro, MCQ Quiz, Notes, and Progress Analytics.
- [x] Comprehensive unit test suite with 100% pass rate.

---

## 📍 Phase 2: Microcontroller Hardware Integration (NEXT 🔜)
- [ ] Flash ESP32-WROOM-32 with the Arduino C++ / ESP-IDF firmware.
- [ ] Connect SSD1306 0.96" I2C OLED display over GPIO 21 (SDA) and GPIO 22 (SCL).
- [ ] Wire 3 status LEDs (Red on GPIO 25, Yellow on GPIO 26, Green on GPIO 27) with 220Ω current-limiting resistors.
- [ ] Implement embedded WebSocket server on ESP32 on port `8080`.
- [ ] Connect `ESP32HardwareAdapter` to the live Wi-Fi IP address.

---

## 📍 Phase 3: Real LLM Integration & Function Calling
- [ ] Implement `GeminiService` using Google Generative AI SDK (`gemini-1.5-pro` / `gemini-1.5-flash`).
- [ ] Connect tool declarations to Gemini Function Calling.
- [ ] Implement streaming responses for real-time text token emission into the Chat UI and OLED display.

---

## 📍 Phase 4: Voice Hardware & Audio Pipeline
- [ ] Integrate I2S microphone (e.g. INMP441) and I2S DAC amplifier (e.g. MAX98357A) into the ESP32.
- [ ] Implement local wake-word detection ("Hey Jarvis").
- [ ] Connect cloud speech-to-text (STT) and neural text-to-speech (TTS).

---

## 📍 Phase 5: Cloud Database & Multi-Device Sync
- [ ] Replace `localStorage` repository with PostgreSQL / Supabase backend.
- [ ] Multi-device sync across desktop browser, tablet, and physical ESP32 desk hardware.
