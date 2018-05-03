int readPin1 = 14; // A0
int readPin2 = 16; // A2

int writePin1 = 8; // 8
int writePin2 = 7; // 7


void setup() {

  // make the pushbutton's pin an input:
  pinMode(readPin1, INPUT);
  pinMode(readPin2, INPUT);

  pinMode(writePin1, OUTPUT);
  pinMode(writePin2, OUTPUT);
}

void loop() {
 int b1 = digitalRead(readPin1);
 int b2 = digitalRead(readPin2);

 digitalWrite(writePin1,b1);
 digitalWrite(writePin2, b2);
}
