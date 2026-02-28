/*
  ============================================================
  SmartFarm Gateway — ESP32 Receiver + Firebase + Crop Logic
  ============================================================
  • Receives LoRa sensor data → pushes to Firebase
  • Reads selected crop from Firebase → sends thresholds to sender
  • Forwards pump/mode commands from Firebase to field node
  • All 90 crops with soil moisture min/max thresholds built-in

  Wiring (ESP32 + SX1278 / RA-02):
    SCK→5  MISO→19  MOSI→27  NSS→18  RST→14  DIO0→26 | VCC→3.3V

  Libraries:
    • LoRa                by Sandeep Mistry
    • ArduinoJson         v6.x  by Benoit Blanchon
    • Firebase ESP32 Client    by Mobizt
  ============================================================
*/

#include <SPI.h>
#include <LoRa.h>
#include <WiFi.h>
#include <ArduinoJson.h>
#include <FirebaseESP32.h>

// ============================================================
// USER CONFIG
// ============================================================
#define WIFI_SSID     "oneplus 11"
#define WIFI_PASSWORD "        "      // <-- fill your password

#define FIREBASE_HOST    "agrinext-8d8b3-default-rtdb.asia-southeast1.firebasedatabase.app"
#define FIREBASE_API_KEY "AIzaSyB6gn97CwZ2MIA6LX16a8ZOMt1n_q8HWqs"
#define FIREBASE_EMAIL    "esp32@agrinext.com"
#define FIREBASE_PASSWORD "Esp32@AgriNext2025"

// ============================================================
// LoRa Pins
// ============================================================
#define LORA_SCK   5
#define LORA_MISO  19
#define LORA_MOSI  27
#define LORA_SS    18
#define LORA_RST   14    // try 23 if init fails
#define LORA_DIO0  26
#define LORA_FREQ  433E6

// ============================================================
// Crop Threshold Table (90 crops)
// Soil moisture min/max in %
// ============================================================
struct CropThreshold {
  const char* name;
  uint8_t     minSoil;
  uint8_t     maxSoil;
};

// clang-format off
const CropThreshold CROPS[] = {
  // Cereals
  {"rice",         60, 90}, {"wheat",        40, 60}, {"maize",        50, 70},
  {"barley",       35, 55}, {"oats",         40, 60}, {"sorghum",      35, 60},
  {"millet",       30, 50},
  // Oilseeds / Legumes
  {"soybean",      55, 75}, {"groundnut",    50, 70}, {"sunflower",    45, 65},
  // Cash Crops
  {"cotton",       55, 75}, {"sugarcane",    65, 85},
  // Vegetables
  {"potato",       60, 75}, {"tomato",       65, 85}, {"onion",        50, 70},
  {"garlic",       45, 65}, {"carrot",       55, 75}, {"cabbage",      60, 80},
  {"cauliflower",  60, 80}, {"brinjal",      60, 80}, {"chilli",       55, 75},
  {"capsicum",     60, 80}, {"cucumber",     65, 85}, {"pumpkin",      60, 80},
  {"watermelon",   55, 75}, {"muskmelon",    55, 75}, {"spinach",      60, 85},
  {"lettuce",      65, 85}, {"radish",       55, 75}, {"beetroot",     55, 75},
  // Pulses
  {"pea",          50, 70}, {"chickpea",     35, 55}, {"lentil",       35, 55},
  {"pigeonpea",    40, 60}, {"blackgram",    40, 60}, {"greengram",    40, 60},
  // Other oilseeds
  {"mustard",      35, 55}, {"sesame",       30, 50}, {"flax",         35, 55},
  {"castor",       40, 60},
  // Fruits
  {"banana",       70, 90}, {"mango",        50, 70}, {"apple",        55, 75},
  {"grapes",       60, 80}, {"orange",       60, 80}, {"lemon",        55, 75},
  {"papaya",       65, 85}, {"guava",        55, 75}, {"pomegranate",  50, 70},
  {"pineapple",    65, 85},
  // Plantation
  {"coffee",       60, 80}, {"tea",          65, 85}, {"cocoa",        70, 90},
  {"rubber",       70, 90}, {"arecanut",     65, 85}, {"coconut",      65, 85},
  {"almond",       45, 65}, {"cashew",       45, 65}, {"walnut",       50, 70},
  {"hazelnut",     50, 70},
  // More vegetables
  {"broccoli",     60, 80}, {"asparagus",    55, 75}, {"celery",       70, 90},
  {"okra",         55, 75}, {"zucchini",     60, 80}, {"turnip",       55, 75},
  {"parsley",      60, 80}, {"mint",         65, 85}, {"coriander",    60, 80},
  {"fenugreek",    55, 75},
  // Herbs
  {"basil",        60, 80}, {"thyme",        40, 60}, {"rosemary",     35, 55},
  {"sage",         40, 60}, {"lavender",     30, 50},
  // Berries
  {"strawberry",   65, 85}, {"blueberry",    70, 90}, {"raspberry",    65, 85},
  {"blackberry",   65, 85}, {"kiwi",         60, 80},
  // Exotic fruits
  {"dragonfruit",  50, 70}, {"jackfruit",    60, 80}, {"lychee",       65, 85},
  {"fig",          45, 65}, {"olive",        30, 50}, {"peach",        55, 75},
  {"pear",         55, 75}, {"plum",         55, 75}, {"apricot",      50, 70},
  {"cherry",       55, 75},
};
// clang-format on

const uint8_t CROP_COUNT = sizeof(CROPS) / sizeof(CROPS[0]);

// Returns true and fills min/max if crop found
bool getCropThreshold(const String& cropName, uint8_t& outMin, uint8_t& outMax) {
  for (uint8_t i = 0; i < CROP_COUNT; i++) {
    if (cropName.equalsIgnoreCase(CROPS[i].name)) {
      outMin = CROPS[i].minSoil;
      outMax = CROPS[i].maxSoil;
      return true;
    }
  }
  return false;
}

// ============================================================
// Firebase
// ============================================================
FirebaseData   fbData;
FirebaseData   fbCmd;
FirebaseConfig fbConfig;
FirebaseAuth   fbAuth;

// ============================================================
// Runtime state
// ============================================================
bool          firebaseReady  = false;
bool          loraReady      = false;
// Default to "field01" so pollCommands() / pollCropConfig() work
// immediately on boot — even before the first LoRa packet arrives.
// Gets overwritten by the actual field-node id once LoRa data arrives.
String        activeNodeId   = "field01";
String        activeCrop     = "";     // last crop pushed to field node
uint8_t       activeCropMin  = 60;
uint8_t       activeCropMax  = 90;

unsigned long lastCmdPoll    = 0;
unsigned long lastCropPoll   = 0;
unsigned long lastHeartbeat  = 0;
unsigned long lastLoraRetry  = 0;

// ============================================================
// WiFi
// ============================================================
void connectWiFi() {
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("📶 Connecting WiFi");
  unsigned long t = millis();
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
    if (millis() - t > 20000) { Serial.println("\n❌ WiFi timeout"); ESP.restart(); }
  }
  Serial.printf("\n✅ WiFi: %s\n", WiFi.localIP().toString().c_str());
}

// ============================================================
// LoRa — non-blocking, retried every 30 s
// ============================================================
bool initLoRa() {
  SPI.begin(LORA_SCK, LORA_MISO, LORA_MOSI, LORA_SS);
  LoRa.setPins(LORA_SS, LORA_RST, LORA_DIO0);
  if (!LoRa.begin(LORA_FREQ)) {
    Serial.println("❌ LoRa init failed — check wiring & 3.3V");
    if (firebaseReady)
      Firebase.setString(fbData, "/smartfarm/gateway/status", "lora_error");
    return false;
  }
  LoRa.setSpreadingFactor(7);
  LoRa.setTxPower(17);
  Serial.println("✅ LoRa ready @433 MHz");
  if (firebaseReady)
    Firebase.setString(fbData, "/smartfarm/gateway/status", "online");
  return true;
}

// ============================================================
// Push sensor data to Firebase
// ============================================================
void pushSensorData(const String& nodeId, float soil, float tank,
                    int pump, const String& mode,
                    const String& crop, float minV, float maxV) {
  String base = "/smartfarm/nodes/" + nodeId;
  Firebase.setString(fbData, base + "/id",        nodeId);
  Firebase.setFloat (fbData, base + "/soil",      soil);
  Firebase.setFloat (fbData, base + "/tank",      tank);
  Firebase.setInt   (fbData, base + "/pump",      pump);
  Firebase.setString(fbData, base + "/mode",      mode);
  Firebase.setString(fbData, base + "/crop",      crop);
  Firebase.setFloat (fbData, base + "/minSoil",   minV);
  Firebase.setFloat (fbData, base + "/maxSoil",   maxV);
  Firebase.setString(fbData, base + "/timestamp", String(millis()));

  // Dry-run status flag
  Firebase.setBool(fbData, base + "/dryRunActive", (tank >= 0 && tank < 20.0));

  // History
  FirebaseJson hist;
  hist.set("soil", soil);
  hist.set("tank", tank);
  hist.set("pump", pump);
  hist.set("mode", mode);
  hist.set("crop", crop);
  hist.set("ts",   (int)(millis() / 1000));
  Firebase.pushJSON(fbData, "/smartfarm/history/" + nodeId, hist);

  Serial.printf("☁️  Firebase ← Soil:%.1f%% Tank:%.1f%% Pump:%s Crop:%s [%.0f–%.0f%%]\n",
                soil, tank, pump ? "ON" : "OFF", crop.c_str(), minV, maxV);
}

// ============================================================
// Send LoRa command to field node
// ============================================================
void sendLoRaCommand(const char* nodeId, const char* cmd) {
  StaticJsonDocument<128> doc;
  doc["id"]  = nodeId;
  doc["cmd"] = cmd;
  char buf[128];
  serializeJson(doc, buf);
  LoRa.beginPacket(); LoRa.print(buf); LoRa.endPacket();
  Serial.printf("📤 LoRa → %s\n", buf);
}

// ============================================================
// Send crop threshold update to field node via LoRa
// ============================================================
void sendCropThreshold(const String& nodeId, const String& crop,
                       uint8_t minSoil, uint8_t maxSoil) {
  StaticJsonDocument<200> doc;
  doc["id"]   = nodeId;
  doc["cmd"]  = "set_threshold";
  doc["crop"] = crop;
  doc["min"]  = minSoil;
  doc["max"]  = maxSoil;
  char buf[200];
  serializeJson(doc, buf);
  LoRa.beginPacket(); LoRa.print(buf); LoRa.endPacket();
  Serial.printf("🌿 Crop threshold sent → %s Min:%d%% Max:%d%%\n",
                crop.c_str(), minSoil, maxSoil);
}

// ============================================================
// Poll Firebase for selected crop — update field node if changed
// ============================================================
void pollCropConfig() {
  if (!firebaseReady) return;
  String path = "/smartfarm/config/" + activeNodeId + "/crop";
  if (!Firebase.getString(fbCmd, path)) return;

  String crop = fbCmd.stringData();
  crop.trim();
  if (crop.isEmpty() || crop == "none" || crop == activeCrop) return;

  uint8_t newMin, newMax;
  if (!getCropThreshold(crop, newMin, newMax)) {
    Serial.printf("⚠️  Unknown crop: %s — not applied\n", crop.c_str());
    return;
  }

  activeCrop    = crop;
  activeCropMin = newMin;
  activeCropMax = newMax;
  Serial.printf("🌱 New crop: %s [%d%%–%d%%]\n", crop.c_str(), newMin, newMax);

  // Store resolved thresholds back to Firebase for web app to display
  Firebase.setFloat(fbData, "/smartfarm/config/" + activeNodeId + "/minSoil", newMin);
  Firebase.setFloat(fbData, "/smartfarm/config/" + activeNodeId + "/maxSoil", newMax);

  if (loraReady)
    sendCropThreshold(activeNodeId, crop, newMin, newMax);
}

// ============================================================
// Poll Firebase for pump/mode commands
// ============================================================
void pollCommands() {
  if (!firebaseReady) return;
  String path = "/smartfarm/commands/" + activeNodeId + "/cmd";
  if (!Firebase.getString(fbCmd, path)) return;

  String cmd = fbCmd.stringData();
  cmd.trim();
  if (cmd.isEmpty() || cmd == "none") return;

  Serial.printf("📬 Command: %s\n", cmd.c_str());
  if (loraReady) sendLoRaCommand(activeNodeId.c_str(), cmd.c_str());
  else           Serial.println("   ⚠️  LoRa offline — not forwarded");
  Firebase.setString(fbCmd, path, "none");
}

// ============================================================
// Handle incoming LoRa packet from field node
// ============================================================
void handleLoRa() {
  if (!loraReady) return;
  int sz = LoRa.parsePacket();
  if (!sz) return;

  String msg = "";
  while (LoRa.available()) msg += (char)LoRa.read();
  Serial.printf("📩 LoRa RSSI:%d dBm | %s\n", LoRa.packetRssi(), msg.c_str());

  StaticJsonDocument<300> doc;
  if (deserializeJson(doc, msg)) {
    Serial.println("⚠️  JSON parse error");
    return;
  }

  String nodeId = doc["id"]   | "unknown";
  float  soil   = doc["soil"] | 0.0f;
  float  tank   = doc["tank"] | 0.0f;
  int    pump   = doc["pump"] | 0;
  String mode   = doc["mode"] | "AUTO";
  String crop   = doc["crop"] | activeCrop;
  float  minV   = doc["min"]  | (float)activeCropMin;
  float  maxV   = doc["max"]  | (float)activeCropMax;

  activeNodeId = nodeId;
  if (firebaseReady)
    pushSensorData(nodeId, soil, tank, pump, mode, crop, minV, maxV);
}

// ============================================================
// Setup
// ============================================================
void setup() {
  Serial.begin(115200);
  delay(500);
  Serial.println("\n========================================");
  Serial.println("   SmartFarm Gateway — Starting up");
  Serial.println("========================================");

  connectWiFi();

  fbConfig.host    = FIREBASE_HOST;
  fbConfig.api_key = FIREBASE_API_KEY;
  fbAuth.user.email    = FIREBASE_EMAIL;
  fbAuth.user.password = FIREBASE_PASSWORD;
  Firebase.begin(&fbConfig, &fbAuth);
  Firebase.reconnectWiFi(true);
  fbData.setResponseSize(4096);
  fbCmd.setResponseSize(512);

  Serial.print("🔐 Signing in to Firebase");
  unsigned long t = millis();
  while (!Firebase.ready()) {
    delay(500); Serial.print(".");
    if (millis() - t > 15000) { Serial.println("\n⚠️  Firebase timeout"); break; }
  }

  if (Firebase.ready()) {
    firebaseReady = true;
    Serial.println("\n✅ Firebase authenticated!");
    Firebase.setString(fbData, "/smartfarm/gateway/status",  "booting");
    Firebase.setString(fbData, "/smartfarm/gateway/user",    FIREBASE_EMAIL);
    Firebase.setInt   (fbData, "/smartfarm/gateway/bootTime",(int)(millis()/1000));
    Firebase.setInt   (fbData, "/smartfarm/gateway/cropCount", CROP_COUNT);
  }

  loraReady = initLoRa();

  Serial.println("========================================");
  Serial.printf("🌿 %d crops loaded\n", CROP_COUNT);
  Serial.println("🎯 Listening for LoRa field nodes...");
  Serial.println("========================================\n");
}

// ============================================================
// Loop
// ============================================================
void loop() {
  if (WiFi.status() != WL_CONNECTED) { connectWiFi(); }

  handleLoRa();

  // LoRa retry every 30 s
  if (!loraReady && millis() - lastLoraRetry >= 30000UL) {
    loraReady = initLoRa();
    lastLoraRetry = millis();
  }

  // Poll crop config every 10 s
  if (millis() - lastCropPoll >= 10000UL) {
    pollCropConfig();
    lastCropPoll = millis();
  }

  // Poll commands every 3 s
  if (millis() - lastCmdPoll >= 3000UL) {
    pollCommands();
    lastCmdPoll = millis();
  }

  // Heartbeat every 60 s
  if (firebaseReady && millis() - lastHeartbeat >= 60000UL) {
    Firebase.setString(fbData, "/smartfarm/gateway/status",
                       loraReady ? "online" : "lora_error");
    Firebase.setInt(fbData, "/smartfarm/gateway/uptime", (int)(millis()/1000));
    lastHeartbeat = millis();
  }

  delay(10);
}
