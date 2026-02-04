#include <WiFi.h>
#include <WebSocketsClient.h>

WebSocketsClient ws;
//for counting
bool collecting = false;
unsigned long startTime = 0;
const unsigned long windowTime = 2000;
int voteCount[6];

// ================= WiFi =================
const char* ssid = "iq";
const char* password = "123456789";

// ================= Server =================
const char* host = "10.94.95.92";
const int port = 5000;
const char* path = "/";

// ================= Sensors =================
const int N = 5;

int pins[N] = {32, 33, 34, 35, 36};

// your stored baseline cutoffs
int cutoff[N] = {2350, 2450, 2500, 2480, 2460};

char lastPattern[6] = "xxxxx";  // track last sent pattern


// =====================================================
// read average ADC
// =====================================================
int readFlex(int pin) {
  long s = 0;
  for (int i = 0; i < 5; i++) {
    s += analogRead(pin);
  }
  return s / 5;
}


// =====================================================
// WebSocket events
// =====================================================
void webSocketEvent(WStype_t type, uint8_t * payload, size_t length) {

  switch (type) {

    case WStype_CONNECTED:
      Serial.println("WS Connected");
      break;

    case WStype_DISCONNECTED:
      Serial.println("WS Disconnected");
      break;

    case WStype_TEXT:
      Serial.printf("RX: %s\n", payload);
      break;

    default:
      break;
  }
}


// =====================================================
// Pattern → Letter mapping
// =====================================================
const char* classifyPattern(const char* pattern) {

  if (!strcmp(pattern, "00001")) return "A";
  if (!strcmp(pattern, "00010")) return "B";
  if (!strcmp(pattern, "00100")) return "C";
  if (!strcmp(pattern, "01000")) return "D";
  if (!strcmp(pattern, "10000")) return "E";

  return " ";
}


// =====================================================
// Send JSON safely
// =====================================================
void sendToServer(int v[], const char* pattern, const char* g) {

  char json[180];
  int r[5];
  for(int i=0;i<=4;i++){
    if(v[i]>cutoff[i])r[i]=1;
    else r[i] =0;
  }
  snprintf(json, sizeof(json),
    "{\"thumb\":%d,\"index\":%d,\"middle\":%d,\"ring\":%d,\"little\":%d,\"pattern\":\"%s\",\"gesture\":\"%s\"}",
    r[0], r[1], r[2], r[3], r[4], pattern, g);

  ws.sendTXT(json);
  Serial.println(json);
}


// =====================================================
// Setup
// =====================================================
void setup() {

  Serial.begin(115200);

  WiFi.begin(ssid, password);
  Serial.print("Connecting WiFi");

  while (WiFi.status() != WL_CONNECTED) {
    delay(300);
    Serial.print(".");
  }

  Serial.println("\nWiFi OK");

  ws.begin(host, port, path);
  ws.onEvent(webSocketEvent);
  ws.setReconnectInterval(3000);

}


// =====================================================
// LOOP
// =====================================================
void loop() {

  ws.loop();

  if (WiFi.status() != WL_CONNECTED) {
    WiFi.reconnect();
    delay(500);
    return;
  }

  static unsigned long lastSampleTime = 0;
  static int sampleTaken = 0;

  int values[N];
  char pattern[6];

  // ================= READ =================
  bool trigger = false;

  for (int i = 0; i < N; i++) {
    values[i] = readFlex(pins[i]);

    if (values[i] > cutoff[i]) {
      pattern[i] = '1';
      trigger = true;          // ANY finger crossed → start window
    }
    else
      pattern[i] = '0';
  }

  pattern[5] = '\0';

  const char* gesture = classifyPattern(pattern);


  // =================================================
  // START WINDOW ONLY WHEN TRIGGERED
  // =================================================
  if (!collecting && trigger) {

    collecting = true;
    startTime = millis();
    lastSampleTime = 0;
    sampleTaken = 0;

    for (int i = 0; i < 6; i++)
      voteCount[i] = 0;
  }


  // =================================================
  // VOTING WINDOW (10 samples)
  // =================================================
  if (collecting) {

    unsigned long now = millis();

    if (now - lastSampleTime >= 100) {

      lastSampleTime = now;
      sampleTaken++;

      if      (strcmp(gesture, "A") == 0) voteCount[0]++;
      else if (strcmp(gesture, "B") == 0) voteCount[1]++;
      else if (strcmp(gesture, "C") == 0) voteCount[2]++;
      else if (strcmp(gesture, "D") == 0) voteCount[3]++;
      else if (strcmp(gesture, "E") == 0) voteCount[4]++;
      else voteCount[5]++;
    }

    // window finished
    if (sampleTaken >= 10) {

      collecting = false;

      int maxIdx = 0;
      for (int i = 1; i < 6; i++) {
        if (voteCount[i] > voteCount[maxIdx])
          maxIdx = i;
      }

      const char* map[6] = {"A","B","C","D","E"," "};
      const char* finalGesture = map[maxIdx];

      // ======= ONLY SEND IF CHANGED (your sacred rule) =======
      if (strcmp(finalGesture, lastPattern) != 0) {

        strcpy(lastPattern, finalGesture);
        sendToServer(values, pattern, finalGesture);
      }
    }
  }
}
