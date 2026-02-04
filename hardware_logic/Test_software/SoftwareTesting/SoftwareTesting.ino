#include <WiFi.h>
#include <WebSocketsClient.h>

WebSocketsClient ws;

/* ========= WIFI ========= */
const char* ssid = "iq";
const char* password = "123456789";

/* ========= SERVER ========= */
const char* host = "10.94.95.92";
const int port = 5000;

/* ========= DATA ========= */
String letters[] = {"H","E","Y"," ","M","A","N"};
int letterCount = 7;

unsigned long lastSend = 0;
const int interval = 700;


/* ========= PRETTY START ========= */
void printBanner() {
  Serial.println("\n\n\n\n\n\n\n\n\n\n");   // fake clear
  Serial.println("==============================");
  Serial.println(" ESP32 STARTING...");
  Serial.println("==============================");
  Serial.println("Scanning networks...");
int n = WiFi.scanNetworks();

for(int i=0;i<n;i++){
  Serial.println(WiFi.SSID(i));
}

}


/* ========= WEBSOCKET EVENTS ========= */
void webSocketEvent(WStype_t type, uint8_t * payload, size_t length) {

  switch(type) {

    case WStype_CONNECTED:
      Serial.println("WebSocket Connected");
      break;

    case WStype_DISCONNECTED:
      Serial.println("WebSocket Disconnected");
      break;

    case WStype_TEXT:
      Serial.printf("Server: %s\n", payload);
      break;

    case WStype_ERROR:
      Serial.println("WebSocket Error");
      break;

    default:
      break;
  }
}


/* ========= WIFI CONNECT ========= */
void connectWiFi() {

  Serial.printf("Connecting to %s\n", ssid);

  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);

  int tries = 0;

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
    tries++;

    if (tries > 40) {   // 20 seconds timeout
      Serial.println("\nWiFi failed. Restarting...");
      ESP.restart();
    }
  }

  Serial.println("\nWiFi Connected!");
  Serial.print("IP: ");
  Serial.println(WiFi.localIP());
}


/* ========= SETUP ========= */
void setup() {

  Serial.begin(115200);
  delay(1000);

  printBanner();

  randomSeed(millis());

  connectWiFi();

  ws.begin(host, port, "/");
  ws.onEvent(webSocketEvent);
  ws.setReconnectInterval(3000);

  Serial.println("WebSocket ready\n");
}


/* ========= LOOP ========= */
void loop() {

  ws.loop();

  if (millis() - lastSend > interval) {

    lastSend = millis();

    int r = random(0, letterCount);

    int thumb  = random(0, 2);
    int index  = random(0, 2);
    int middle = random(0, 2);
    int ring   = random(0, 2);
    int little = random(0, 2);

    String json = String("{\"thumb\":") + thumb +
                  ",\"index\":" + index +
                  ",\"middle\":" + middle +
                  ",\"ring\":" + ring +
                  ",\"little\":" + little +
                  ",\"gesture\":\"" + letters[r] + "\"}";

    if (ws.isConnected()) {
      ws.sendTXT(json);
      Serial.println(json);
    }
  }
}
