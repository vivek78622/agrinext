# Smart Farm & Crop Advisor System

An intelligent, full-stack agricultural platform designed to optimize farming through AI-driven crop recommendations and automated IoT-based irrigation.

## Overview

The Smart Farm & Crop Advisor System integrates real-time environmental data with machine learning algorithms and IoT hardware to help farmers make data-driven decisions. It features a complete pipeline from suggesting the best crops to plant based on NASA weather data, to automatically watering the fields based on crop-specific soil moisture thresholds.

## Project Structure

The repository consists of 3 main components:

- **`web/` - Frontend Dashboard**
  - Built with **Next.js 16**, React 19, and TailwindCSS.
  - Provides a user-friendly interface to view crop recommendations, monitor soil moisture, and control the irrigation pump.
  - Integrates with Firebase for real-time state synchronization with the IoT hardware.

- **`crop_advisor_api/` - Backend Recommendation Engine**
  - Built with **Python (FastAPI)**.
  - AI-powered crop recommendation system using an advanced 9-model scoring algorithm.
  - Integrates with **NASA POWER API** to fetch real-time and historical environmental data (temperature, rainfall, soil moisture).
  - Features multiple analysis strategies (Land, Soil, Water, Climate, Cost, Risk, Market, Demand) and an LLM synthesis feature via OpenRouter.
  - Background job processing for complex analysis pipeline executions.

- **IoT Firmware (ESP32)**
  - Arduino sketches (`esp32_firebase_sender.ino`, `esp32_firebase_receiver.ino`) for ESP32 microcontrollers.
  - **Auto Mode:** Intelligently monitors soil moisture sensors and automatically controls the water pump based on specific crop moisture requirements. Includes dry-run protection to prevent the pump from running when the water tank level is critically low.
  - **Manual Mode:** Allows the user to toggle the pump directly from the web dashboard.
  - Communicates synchronously with Firebase Realtime Database.

## Key Features

- **Intelligent Crop Selection:** Recommends the optimal crops based on soil type, budget, location, and real-time weather data.
- **Automated Irrigation:** Monitors soil moisture and water tank levels, turning the pump on/off only when necessary, preventing water waste and crop stress.
- **Remote Control and Monitoring:** Full visibility into farm conditions and manual override capabilities via the web dashboard.
- **Predictive Analytics:** Uses advanced mathematical scoring strategies and LLM analysis to forecast market demand, risk, and ROI.
- **Hardware Protection:** Automatically detects low water levels to prevent pump dry-run damage.

## Getting Started

### Prerequisites

- Node.js (v18+)
- Python (3.10+)
- Arduino IDE (for ESP32 programming)
- Firebase Account (for Realtime DB configuration)
- OpenRouter API Key (for LLM backend capabilities)

### Running the Project Locally

You can start both the web dashboard and the Python API simultaneously using the provided batch script:

```bash
# On Windows
start_all.bat
```

**Alternative Manual Startup:**

1. **Frontend (Next.js):**
   ```bash
   cd web
   npm install
   npm run dev
   ```
   *Runs on http://localhost:3000*

2. **Backend API (FastAPI):**
   ```bash
   cd crop_advisor_api
   pip install -r requirements.txt
   python app/main.py
   ```
   *Runs on http://localhost:8000*

## Architecture & Data Flow

1. The **ESP32 Sender Node** reads hardware sensor data (soil moisture, tank levels) and posts it real-time to Firebase.
2. The **Web Dashboard** listens to updates from Firebase and provides a live view of the farm to the user.
3. The user requests crop advice via the web UI, which queries the **Crop Advisor FastAPI Backend**.
4. The Backend evaluates the local site constraints, fetches weather from **NASA POWER**, applies heuristic scoring, and returns fully calculated crop recommendations.
5. Once a user targets a crop, its specific moisture thresholds are saved. The **ESP32 Receiver Node** will pull this from Firebase to safely automate the water pump.

## Technology Stack

- **Frontend:** Next.js, React, Tailwind CSS, Framer Motion, Chart.js
- **Backend:** Python, FastAPI, Pydantic, ARQ (Job Queues)
- **IoT / Embedded:** C++ (Arduino), ESP32 modules, Capacitive Soil Moisture Sensors, Relays
- **Services:** Firebase (Realtime Database & Authentication), NASA POWER API, OpenRouter (LLM)
