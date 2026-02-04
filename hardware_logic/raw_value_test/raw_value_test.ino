const int flex1 = 34;
const int flex2 = 35;

const int TH1 = 2000;   
const int TH2 = 2360;   

int readFlex(int pin) {
  long sum = 0;
  for (int i = 0; i < 20; i++) {
    sum += analogRead(pin);
    delay(10);
  }
  return sum / 20;
}

void setup() {
  Serial.begin(115200);
  delay(500);
  Serial.println("Flex pattern streaming...");
}

void loop() {
  int v1 = readFlex(flex1);
  int v2 = readFlex(flex2);

  int bit1 = (v1 >= TH1) ? 1 : 0;
  int bit2 = (v2 >= TH2) ? 1 : 0;

 
  Serial.print(bit1);
  Serial.print(bit2);
  Serial.print("  ||  ");
  Serial.print(v1);
  Serial.print("  ");
  Serial.print(v2);
  Serial.println("   ");   
  delay(500);   
}
