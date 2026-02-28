<div align="center">

<img src="web/public/images/stitch_satellite.jpg" alt="AgriNext Banner" width="100%" style="border-radius:12px;" />

# 🌾 AgriNext — Intelligent Smart Farm Platform

**An end-to-end AI-powered agricultural system combining 9-model machine intelligence, real-time IoT automation, satellite weather data, and LLM synthesis to help farmers grow smarter.**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Python-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Realtime_DB-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com/)
[![ESP32](https://img.shields.io/badge/IoT-ESP32-E7352C?logo=espressif&logoColor=white)](https://www.espressif.com/)
[![NASA POWER](https://img.shields.io/badge/Data-NASA_POWER-0B3D91?logo=nasa&logoColor=white)](https://power.larc.nasa.gov/)
[![OpenRouter](https://img.shields.io/badge/LLM-OpenRouter-6C47FF)](https://openrouter.ai/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green)](LICENSE)

[🚀 Live Demo](#getting-started) · [📖 Docs](#architecture--data-flow) · [🐛 Issues](https://github.com/vivek78622/agrinext/issues) · [💡 Features](#key-features)

</div>

---

## 🌍 The Vision

> *"Where technology and tradition meet to solve global food security challenges."*

AgriNext empowers farmers with precision agriculture tools that were once only available to large agribusinesses. By combining satellite weather data, soil science, market economics, and AI reasoning — all in one unified platform — it helps every farmer make the best decision for their land, every season.

The name **AgriNext** represents the **next generation of agriculture**: data-driven, automated, and intelligent.

---

## ⚡ Key Features

| Feature | Description |
|---|---|
| 🧠 **9-Model AI Engine** | Analyses crops across Land, Soil, Water, Climate, Economic, Risk, Market, Demand & LLM Synthesis dimensions |
| 🌦️ **NASA POWER Integration** | Fetches real-time & historical satellite weather data (rainfall, temperature, solar radiation) for any GPS location |
| 🤖 **LLM Synthesis** | Uses OpenRouter to generate deep narrative crop advice via large language models |
| 💧 **Automated Irrigation** | ESP32-based soil moisture monitoring with auto pump control and dry-run protection |
| 📱 **Live Dashboard** | Real-time farm monitoring — pump status, moisture levels, weather, and crop data |
| 🔒 **Dry-Run Protection** | Automatic hardware safeguard that disables the pump if water tank is critically low |
| 📊 **Full Analytics** | Streaming multi-model analysis UI with animated model cards and confidence scores |
| 🌐 **Remote Control** | Manual pump override from anywhere via the web dashboard |

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        AgriNext Platform                        │
├──────────────────┬──────────────────────┬───────────────────────┤
│   🖥️  FRONTEND    │    ⚙️  BACKEND API    │   📡  IoT FIRMWARE    │
│   (Next.js 16)   │  (Python / FastAPI)  │      (ESP32 C++)      │
├──────────────────┼──────────────────────┼───────────────────────┤
│  Dashboard       │  9-Model AI Engine   │  Sender Node          │
│  Crop Advisor    │  NASA POWER Fetch    │  ├─ Soil Moisture      │
│  Full Analysis   │  LLM Orchestrator    │  ├─ Tank Level         │
│  Live Simulation │  Background Jobs     │  └─ Push to Firebase  │
│  Control Panel   │  (ARQ / Redis)       │                       │
│  History         │  REST + SSE Stream   │  Receiver Node        │
└──────┬───────────┴──────────┬───────────┴──────────┬────────────┘
       │                      │                      │
       └──────────────────────┼──────────────────────┘
                              │
               ┌──────────────▼──────────────┐
               │   🔥 Firebase Realtime DB   │
               │  (State Sync & Auth)        │
               └─────────────────────────────┘
```

---

## 🧠 The 9-Model AI Engine (Deep Dive)

The core intelligence of AgriNext is its **layered, 9-model scoring pipeline**. Each model analyses a different agricultural dimension:

### Layer 1: Pre-screening (Data Gathering)
Before the AI scores anything, it first:
- Fetches **GPS-based location data** for the farm
- Retrieves **7-10 years of historical climate data** from NASA POWER (more accurate than local weather stations)
- Collects **soil data**, **budget**, and **water availability** from user inputs

### Layer 2: 9-Model Scoring Engine

| Model | Focus Area | Key Factors |
|---|---|---|
| **Model 1** | 🌍 Land & Location | GPS suitability, elevation, terrain |
| **Model 2** | 🪨 Soil Analysis | Soil type (Alluvial/Sandy/Clay/Loamy/Red/Black), pH, nutrients |
| **Model 3** | 💧 Water Resources | Available water, irrigation method, rainfall compatibility |
| **Model 4** | 🌤️ Climate Matching | Temperature range, humidity, frost risk, season alignment |
| **Model 5** | 💰 Economic Viability | Input costs, market price, break-even analysis, ROI |
| **Model 6** | ⚠️ Risk Assessment | Drought risk, flood risk, pest susceptibility, heat stress |
| **Model 7** | 📈 Market Access | Distance to market, transport infrastructure, price volatility |
| **Model 8** | 📊 Demand Forecasting | Market sentiment (bullish/bearish), demand cycles, supply gaps |
| **Model 9** | 🤖 LLM Synthesis | Narrative reasoning from an LLM combining all model outputs |

### Scoring Formula

```python
# Smooth Linear Interpolation scoring (no harsh cutoffs)
base_score = (
    rainfall × 0.12 + soil × 0.10 + water × 0.10 +
    climate × 0.15 + economic × 0.18 + demand × 0.12 +
    market_access × 0.08
) / 0.85

risk_penalty  = risk_index × 0.25         # High risk reduces score significantly
overall_score = clamp(base_score - risk_penalty, 0, 100)
```

The engine ranks all candidate crops and returns:
- 🥇 **Best Crop** (highest overall score)
- 🥈🥉 **2 Alternative Crops** (next best options)
- 🌱 **Cropping System** recommendation (Standalone / Intercrop / Sequential)
- 🎯 **Confidence Score** for the entire recommendation

---

## 💧 Smart Irrigation System

The ESP32-based irrigation system uses **two coordinated firmware nodes**:

### Sender Node (`esp32_firebase_sender.ino`)
- Continuously reads **capacitive soil moisture sensors**
- Monitors **water tank level** via ultrasonic sensor
- Calculates soil moisture percentage
- Pushes all readings to **Firebase Realtime Database** every cycle

### Receiver Node (`esp32_firebase_receiver.ino`)
Reads the latest data from Firebase and applies smart logic:

```
If MODE == MANUAL:
    Follow pump command directly from the dashboard

If MODE == AUTO:
    Read current soil moisture + tank level from Firebase
    Read target crop moisture threshold (set when user selects a crop)

    If tank_level < CRITICAL_LOW:
        → STOP pump (DRY-RUN PROTECTION 🔒)
    Elif soil_moisture < crop_min_threshold:
        → START pump (soil too dry)
    Elif soil_moisture > crop_max_threshold:
        → STOP pump (soil adequately watered)
    Else:
        → No action (maintain current state)
```

This prevents over/under-watering and **protects the pump hardware** from running dry.

---

## 🖥️ Frontend Pages

| Page | Route | Description |
|---|---|---|
| **Dashboard** | `/dashboard` | Real-time farm overview: moisture, pump status, weather |
| **Crop Advisor** | `/crop-advisor` | Input soil, budget, location → get AI crop recommendations |
| **Full Analysis** | `/crop-advisor/full-analysis` | Live streaming 9-model analysis with animated model cards |
| **Crop Analysis** | `/crop-analysis` | Detailed breakdown of a selected crop's scores |
| **Control Panel** | `/control` | Manual pump control + analytics + history sidebar |

---

## 🗂️ Project Structure

```
agrinext/
├── web/                          # Next.js 16 Frontend
│   ├── src/
│   │   ├── app/(main)/           # Page routes (dashboard, crop-advisor, control)
│   │   ├── components/           # Reusable UI components
│   │   │   ├── crop-advisor/     # ModelCard, SynthesisCard, VerdictCard
│   │   │   ├── control/          # AnalyticsPanel, HistorySidebar
│   │   │   └── dashboard/        # Live sensor displays
│   │   ├── services/             # API calls, Firebase listeners
│   │   ├── contexts/             # React Context for state
│   │   └── hooks/                # Custom React hooks
│   ├── public/images/            # Soil type images, satellite imagery
│   ├── firebase.json             # Firebase hosting config
│   └── package.json
│
├── agri 2/backend/               # Python FastAPI Backend
│   ├── app/
│   │   ├── models/               # 9-model scoring pipeline
│   │   │   ├── model1_land.py    # Land & Location scoring
│   │   │   ├── model2_soil.py    # Soil analysis
│   │   │   ├── model3_water.py   # Water resource scoring
│   │   │   ├── model4_climate.py # Climate matching
│   │   │   ├── model5_economic.py# Economic viability
│   │   │   ├── model6_risk.py    # Risk assessment
│   │   │   ├── model7_market.py  # Market access
│   │   │   ├── model8_demand.py  # Demand forecasting
│   │   │   └── model9_synthesis.py# LLM narrative synthesis
│   │   ├── services/
│   │   │   ├── nasa_power.py     # NASA POWER API client
│   │   │   └── llm_orchestrator.py# OpenRouter LLM client
│   │   └── main.py               # FastAPI app entry point
│   └── requirements.txt
│
├── esp32_firebase_sender.ino     # ESP32 Sensor Node firmware
├── esp32_firebase_receiver.ino   # ESP32 Pump Controller firmware
├── scripts/                      # Utility scripts
├── start_all.bat                 # One-click start (Windows)
└── START_BACKEND.bat             # Backend-only start
```

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | Next.js 16, React 19, TypeScript |
| **Styling** | Tailwind CSS, Framer Motion |
| **Charts & Viz** | Chart.js, Recharts |
| **Backend** | Python 3.10+, FastAPI, Pydantic |
| **Background Jobs** | ARQ (Async Redis Queue) |
| **IoT Firmware** | C++ (Arduino), ESP32 |
| **Sensors** | Capacitive Soil Moisture, Ultrasonic (Tank Level) |
| **Database & Auth** | Firebase Realtime Database, Firebase Auth |
| **Weather Data** | NASA POWER API (satellite-grade, free) |
| **LLM Provider** | OpenRouter API (multi-model, free tier) |
| **Hardware** | ESP32 DevKit, 5V Relay Module, Submersible Pump |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+
- **Python** 3.10+
- **Arduino IDE** (for ESP32 firmware)
- **Firebase Account** (Realtime Database + Auth)
- **OpenRouter API Key** (free tier available at [openrouter.ai](https://openrouter.ai))

### 1. Clone the Repository

```bash
git clone https://github.com/vivek78622/agrinext.git
cd agrinext
```

### 2. Configure Environment Variables

Create `web/.env.local`:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your_project-default-rtdb.firebaseio.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

Create `agri 2/backend/.env`:
```env
OPENROUTER_API_KEY=your_openrouter_key
FIREBASE_DATABASE_URL=https://your_project-default-rtdb.firebaseio.com
```

### 3. One-Click Start (Windows)

```bat
start_all.bat
```

This launches both the Next.js frontend and the FastAPI backend simultaneously.

### 4. Manual Start

**Frontend:**
```bash
cd web
npm install
npm run dev
# → http://localhost:3000
```

**Backend:**
```bash
cd "agri 2/backend"
pip install -r requirements.txt
python app/main.py
# → http://localhost:8000
# → API docs at http://localhost:8000/docs
```

### 5. Flash ESP32 Firmware

1. Open `esp32_firebase_sender.ino` in Arduino IDE
2. Install required libraries: `Firebase ESP32`, `ArduinoJson`
3. Set your Firebase credentials and WiFi SSID/password in the sketch
4. Flash to your **sender ESP32** (sensor node)
5. Repeat steps for `esp32_firebase_receiver.ino` on your **receiver ESP32** (pump controller)

---

## 🔄 Data Flow

```
User → Web Dashboard
         │
         ├──→ Crop Advisor: Enter soil type, budget, GPS, water availability
         │         │
         │         └──→ FastAPI Backend
         │                   │
         │                   ├──→ NASA POWER API (fetches 7-10yr weather data)
         │                   ├──→ 9-Model Scoring Pipeline
         │                   └──→ OpenRouter LLM (Model 9 synthesis)
         │                             │
         │                   ←─────────┘ Returns ranked crop recommendations
         │
         ├──→ User selects target crop
         │         │
         │         └──→ Crop moisture thresholds saved to Firebase
         │
ESP32 Receiver reads thresholds from Firebase
         │
         └──→ Auto-controls water pump based on live sensor readings
                   │
         ESP32 Sender pushes live sensor data → Firebase → Dashboard (live view)
```

---

## 📡 API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Health check |
| `POST` | `/analyze` | Start full 9-model crop analysis |
| `GET` | `/analyze/{job_id}/stream` | Stream analysis results (SSE) |
| `GET` | `/crops` | List all supported crops |
| `POST` | `/recommend` | Quick recommendation (no streaming) |
| `GET` | `/nasa/weather` | Fetch NASA POWER weather for GPS location |
| `GET` | `/docs` | Interactive API documentation (Swagger UI) |

---

## 🌱 Supported Crops

The engine currently supports analysis for 30+ crops across categories:

- **Cereals**: Rice, Wheat, Maize, Sorghum, Millet
- **Pulses**: Chickpea, Lentil, Pigeon Pea, Mung Bean, Black-eyed Pea
- **Oilseeds**: Soybean, Sunflower, Groundnut, Mustard, Sesame
- **Cash Crops**: Sugarcane, Cotton, Tobacco, Turmeric, Ginger
- **Vegetables**: Tomato, Onion, Potato, Brinjal, Chilli
- **Fruits**: Banana, Papaya, Mango, Guava

---

## 🤝 Contributing

Contributions are welcome! If you'd like to add a new crop, improve a scoring model, or build a new UI feature:

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/awesome-feature`
3. Commit your changes: `git commit -m 'feat: add awesome feature'`
4. Push to the branch: `git push origin feature/awesome-feature`
5. Open a Pull Request

---

## 👨‍💻 Author

**Vivek** — [@vivek78622](https://github.com/vivek78622)

*Built with passion for making precision agriculture accessible to every farmer. 🌾*

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**⭐ Star this repo if AgriNext helps you or inspires you!**

*Made with ❤️ for farmers everywhere*

</div>
