const int N = 5;

int flexPins[N] = {32, 33, 34, 35, 36};
int TH[N]       = {2500, 2350, 2200, 2390, 2400};

unsigned long lastPrint = 0;
const unsigned long interval = 1000;   // 1 second

int readFlex(int pin) {
  long sum = 0;
  for (int i = 0; i < 20; i++) {
    sum += analogRead(pin);
    delay(5);   // small stabilization delay
  }
  return sum / 20;
}

void setup() {
  Serial.begin(115200);
  delay(500);
  Serial.println("5-Flex pattern streaming...");
}

void loop() {

  if (millis() - lastPrint >= interval) {
    lastPrint = millis();

    int values[N];
    int bits[N];

    // Read all sensors
    for (int i = 0; i < N; i++) {
      values[i] = readFlex(flexPins[i]);
      bits[i] = (values[i] >= TH[i]) ? 1 : 0;
    }

    // Print binary pattern
    Serial.print("Pattern: ");
    for (int i = 0; i < N; i++) {
      Serial.print(bits[i]);
    }

    // Print raw values
    Serial.print("  ||  Values: ");
    for (int i = 0; i < N; i++) {
      Serial.print(values[i]);
      Serial.print(" ");
    }

    Serial.println();
  }
}