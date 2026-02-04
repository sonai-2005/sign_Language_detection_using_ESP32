#include "BluetoothSerial.h"

BluetoothSerial BT;

const int flex1 = 34;
const int flex2 = 35;

const int TH1 = 2000;
const int TH2 = 2360;

String gesture;
int lastPattern = -1;
int count = 0;

// --------- smooth reading ----------
int readFlex(int pin) {
  long sum = 0;
  for (int i = 0; i < 20; i++) {
    sum += analogRead(pin);
    delay(5);          // faster averaging
  }
  return sum / 20;
}

// -------- Bluetooth debug ----------
void communicate() {
  if (Serial.available()) {
    String pcMsg = Serial.readStringUntil('\n');
    Serial.print(pcMsg);
    BT.println(" PC: "+pcMsg);
    
  }
  if (BT.available()) {
    String msg = BT.readStringUntil('\n');
    Serial.println("BT device: " + msg);
  }
}

void setup() {
  Serial.begin(115200);
  delay(1000);

  BT.begin("saptarshi_test");   // avoid spaces & apostrophe
  Serial.println("Bluetooth Started...");
  Serial.println("---------------- START ----------------");
}

void loop() {

  int v1 = readFlex(flex1);
  int v2 = readFlex(flex2);
  communicate();

  int bit1 = (v1 >= TH1) ? 1 : 0;
  int bit2 = (v2 >= TH2) ? 1 : 0;

  int currentPattern = (bit1 << 1) | bit2;  // 00→0, 01→1, 10→2, 11→3

  if (currentPattern != lastPattern) {

    Serial.print(count);
    Serial.print(": Pattern = ");
    Serial.print(bit1);
    Serial.print(bit2);
    Serial.print(" | v1=");
    Serial.print(v1);
    Serial.print(" v2=");
    Serial.print(v2);
    Serial.print(" | result = ");

    switch (currentPattern) {
      case 0: gesture = "neutral"; break;
      case 1: gesture = "FLEX--A"; break;
      case 2: gesture = "FLEX--B"; break;
      case 3: gesture = "FLEX--C"; break;
    }

    Serial.println(gesture);

    // ---- send clean output to phone ----
    BT.print(bit1);
    BT.print(bit2);
    BT.println("  ||  "+gesture);

    count++;
    lastPattern = currentPattern;
  }

  delay(100);
}
