/*
  ============================================================
  SmartFarm Field Node — ESP32 Sender
  ============================================================
  Auto-irrigation with:
   • Crop-specific soil moisture thresholds (set via LoRa from Gateway)
   • Dry-run protection — pump forced OFF when tank < 20%

  LoRa Commands received from Gateway:
    {"id":"field01","cmd":"pump_on"}
    {"id":"field01","cmd":"pump_off"}
    {"id":"field01","cmd":"mode_auto"}
    {"id":"field01","cmd":"mode_manual"}
    {"id":"field01","cmd":"set_threshold","min":60,"max":90}

  Libraries:
    • LoRa          by Sandeep Mistry
    • ArduinoJson   v6.x
  ============================================================
*/

#include <SPI.h>
#include <LoRa.h>
#include <ArduinoJson.h>

// ============================================================
// Pins
// ============================================================
#define TRIG_PIN   25
#define ECHO_PIN   32
#define SOIL_PIN   34
#define RELAY_PIN  23

// LoRa
#define LORA_SCK   5
#define LORA_MISO  19
#define LORA_MOSI  27
#define LORA_SS    18
#define LORA_RST   14
#define LORA_DIO0  26
const long LORA_FREQ = 433E6;

// ============================================================
// Sensor Calibration
// ============================================================
const int   SOIL_DRY      = 4095;
const int   SOIL_WET      = 1680;
const float TANK_FULL_CM  = 2.78;
const float TANK_EMPTY_CM = 15.0;

// ============================================================
// Dry-run protection threshold — pump OFF if tank below this
// ============================================================
const float TANK_DRY_RUN_PCT = 20.0;

// ============================================================
// Node identity
// ============================================================
const char* nodeId = "field01";

// ============================================================
// State
// ============================================================
bool          pumpOn            = false;
bool          autoMode          = true;
bool          thresholdReceived = false;   // stays false until gateway sends crop
unsigned long seqNo             = 0;

// Crop thresholds — set ONLY via LoRa set_threshold from Gateway
// No defaults: auto logic is dormant until dashboard selects a crop
float cropMinSoil = 0.0;
float cropMaxSoil = 0.0;
char  currentCrop[32] = "";

// ============================================================
// Relay
// ============================================================
void setRelay(bool on) {
  digitalWrite(RELAY_PIN, on ? LOW : HIGH);
  pumpOn = on;
  Serial.printf("Relay → %s\n", on ? "ON" : "OFF");
}

// ============================================================
// Soil moisture (%)
// ============================================================
float readSoilPercent() {
  int raw = analogRead(SOIL_PIN);
  float pct = (float)(SOIL_DRY - raw) * 100.0f / (SOIL_DRY - SOIL_WET);
  return constrain(pct, 0.0f, 100.0f);
}

// ============================================================
// Tank level (% via ultrasonic)
// ============================================================
float readUltrasonicCM() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);
  long us = pulseIn(ECHO_PIN, HIGH, 30000UL);
  return (us == 0) ? -1.0f : (us * 0.0343f) / 2.0f;
}

float tankPercent(float distCM) {
  if (distCM < 0) return -1.0f;
  float frac = (TANK_EMPTY_CM - distCM) / (TANK_EMPTY_CM - TANK_FULL_CM);
  return constrain(frac * 100.0f, 0.0f, 100.0f);
}

// ============================================================
// Auto irrigation logic
//   • Uses crop-specific thresholds (cropMinSoil / cropMaxSoil)
//   • Dry-run protection: if tank < 20% → pump OFF regardless
// ============================================================
void runAutoLogic(float soil, float tank) {
  // Dormant until crop threshold received from Gateway via LoRa
  if (!thresholdReceived) {
    Serial.println("⏳ AUTO waiting — no crop threshold set yet (select a crop on dashboard)");
    return;
  }

  // --- Dry-run protection (highest priority) ---
  if (tank >= 0 && tank < TANK_DRY_RUN_PCT) {
    if (pumpOn) {
      setRelay(false);
      Serial.println("⚠️  DRY-RUN PROTECTION — Tank < 20% — Pump forced OFF");
    }
    return;
  }

  // --- Crop threshold logic ---
  if (soil < cropMinSoil && !pumpOn) {
    setRelay(true);
    Serial.printf("💧 Pump ON — Soil %.1f%% < min %.0f%% [%s]\n",
                  soil, cropMinSoil, currentCrop);
  } else if (soil >= cropMaxSoil && pumpOn) {
    setRelay(false);
    Serial.printf("🛑 Pump OFF — Soil %.1f%% >= max %.0f%% [%s]\n",
                  soil, cropMaxSoil, currentCrop);
  }
}

// ============================================================
// Send status packet via LoRa
// ============================================================
void sendStatus() {
  float soil = readSoilPercent();
  float dist = readUltrasonicCM();
  float tank = tankPercent(dist);

  if (autoMode) runAutoLogic(soil, tank);

  // Status line — shows "NO CROP" until threshold received
  if (thresholdReceived) {
    Serial.printf("\n[%s] Soil:%.1f%% Tank:%.1f%% Pump:%s Mode:%s | Range:%.0f%%–%.0f%%\n",
                  currentCrop, soil, tank,
                  pumpOn ? "ON" : "OFF",
                  autoMode ? "AUTO" : "MANUAL",
                  cropMinSoil, cropMaxSoil);
  } else {
    Serial.printf("\n[NO CROP] Soil:%.1f%% Tank:%.1f%% Pump:%s Mode:%s | Waiting for crop selection\n",
                  soil, tank,
                  pumpOn ? "ON" : "OFF",
                  autoMode ? "AUTO" : "MANUAL");
  }

  StaticJsonDocument<256> doc;
  doc["id"]             = nodeId;
  doc["seq"]            = seqNo++;
  doc["soil"]           = soil;
  doc["tank"]           = tank;
  doc["pump"]           = pumpOn ? 1 : 0;
  doc["mode"]           = autoMode ? "AUTO" : "MANUAL";
  doc["crop"]           = thresholdReceived ? currentCrop : "";
  doc["min"]            = thresholdReceived ? cropMinSoil : 0;
  doc["max"]            = thresholdReceived ? cropMaxSoil : 0;
  doc["cropReady"]      = thresholdReceived ? 1 : 0;

  char out[256];
  serializeJson(doc, out);
  LoRa.beginPacket();
  LoRa.print(out);
  LoRa.endPacket();
  Serial.printf("📤 Sent: %s\n", out);
}

// ============================================================
// Handle incoming LoRa commands from Gateway
// ============================================================
void handleIncoming() {
  int packetSize = LoRa.parsePacket();
  if (!packetSize) return;

  String msg = "";
  while (LoRa.available()) msg += (char)LoRa.read();
  Serial.printf("📥 Received: %s\n", msg.c_str());

  StaticJsonDocument<200> doc;
  if (deserializeJson(doc, msg)) return;

  // Only process commands for this node
  const char* target = doc["id"];
  if (!target || strcmp(target, nodeId) != 0) return;

  const char* cmd = doc["cmd"];
  if (!cmd) return;

  if (strcmp(cmd, "pump_on") == 0) {
    setRelay(true);
    autoMode = false;

  } else if (strcmp(cmd, "pump_off") == 0) {
    setRelay(false);
    autoMode = false;

  } else if (strcmp(cmd, "mode_auto") == 0) {
    autoMode = true;
    Serial.println("Mode → AUTO");

  } else if (strcmp(cmd, "mode_manual") == 0) {
    autoMode = false;
    Serial.println("Mode → MANUAL");

  } else if (strcmp(cmd, "set_threshold") == 0) {
    // Receive crop thresholds from Gateway (dashboard → Firebase → LoRa)
    float newMin = doc["min"] | 0.0f;
    float newMax = doc["max"] | 0.0f;
    const char* crop = doc["crop"] | "";

    if (newMin > 0 && newMax > newMin && strlen(crop) > 0) {
      cropMinSoil = newMin;
      cropMaxSoil = newMax;
      strncpy(currentCrop, crop, sizeof(currentCrop) - 1);
      currentCrop[sizeof(currentCrop) - 1] = '\0';
      thresholdReceived = true;
      Serial.printf("🌿 Threshold received → %s | Min:%.0f%% Max:%.0f%% — AUTO active\n",
                    currentCrop, cropMinSoil, cropMaxSoil);
    } else {
      Serial.println("⚠️  set_threshold ignored — invalid values");
    }
  }
}

// ============================================================
// Setup
// ============================================================
void setup() {
  Serial.begin(115200);
  Serial.println("\n=== SmartFarm Field Node ===");

  pinMode(TRIG_PIN,  OUTPUT);
  pinMode(ECHO_PIN,  INPUT);
  pinMode(SOIL_PIN,  INPUT);
  pinMode(RELAY_PIN, OUTPUT);
  setRelay(false);

  SPI.begin(LORA_SCK, LORA_MISO, LORA_MOSI, LORA_SS);
  LoRa.setPins(LORA_SS, LORA_RST, LORA_DIO0);
  if (!LoRa.begin(LORA_FREQ)) {
    Serial.println("❌ LoRa init failed");
    while (1);
  }
  LoRa.setSpreadingFactor(7);
  LoRa.setTxPower(17);
  Serial.println("✅ LoRa Ready @433 MHz");
  Serial.println("⏳ AUTO mode dormant — select a crop on the dashboard to activate");
}

// ============================================================
// Loop
// ============================================================
void loop() {
  handleIncoming();

  static unsigned long lastSend = 0;
  if (millis() - lastSend >= 10000UL) {
    sendStatus();
    lastSend = millis();
  }
}
