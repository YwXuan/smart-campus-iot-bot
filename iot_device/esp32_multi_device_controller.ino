#include <SPI.h>
#include <MFRC522.h>
#include <HardwareSerial.h>
#include <LiquidCrystal_I2C.h>

#define CMD_ALL_ON       10
#define CMD_ALL_OFF      11
#define CMD_FAN_ON       20
#define CMD_FAN_OFF      21
#define CMD_FAN_TOGGLE   22
#define CMD_FAN_DIR_TOGGLE 23
#define CMD_FAN_DIR_FWD  24
#define CMD_FAN_DIR_REV  25
#define CMD_LIGHT_FRONT_ON  33
#define CMD_LIGHT_FRONT_OFF 34
#define CMD_LIGHT_BACK_ON   35
#define CMD_LIGHT_BACK_OFF  36
#define CMD_PC_ON         50
#define CMD_PC_OFF        51

#define SS_PIN 5
#define RST_PIN 4
MFRC522 mfrc522(SS_PIN, RST_PIN);

LiquidCrystal_I2C lcd(0x27, 16, 2);

#define HC05_RX 16
#define HC05_TX 17
HardwareSerial BTSerial(1);

#define LED_FRONT_PIN 2
#define LED_BACK_PIN 0
#define PC_PIN 32
#define FAN_IN1 26
#define FAN_IN2 27

bool lightFrontStatus = false;
bool lightBackStatus = false;
bool pcStatus = false;
bool fanPower = false;
bool fanDirection = false;

void updateLCD() {
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Fan:");
  lcd.print(fanPower ? "ON " : "OFF");
  lcd.print(fanDirection ? "<<" : ">>");
  lcd.setCursor(0, 1);
  lcd.print("L1:");
  lcd.print(lightFrontStatus ? "ON " : "OFF");
  lcd.print(" L2:");
  lcd.print(lightBackStatus ? "ON" : "OFF");
}

void updateFanStatus() {
  if (!fanPower) {
    digitalWrite(FAN_IN1, LOW);
    digitalWrite(FAN_IN2, LOW);
    Serial.println("🌀 風扇電源：關閉");
  } else {
    if (fanDirection) {
      digitalWrite(FAN_IN1, HIGH);
      digitalWrite(FAN_IN2, LOW);
      Serial.println("🌀 風扇方向：反轉");
    } else {
      digitalWrite(FAN_IN1, LOW);
      digitalWrite(FAN_IN2, HIGH);
      Serial.println("🌀 風扇方向：順轉");
    }
  }
  updateLCD();
}

void processCommand(String command) {
  command.trim();
  int cmd = command.toInt();
  Serial.print("收到命令: ");
  Serial.println(cmd);

  if (cmd == CMD_ALL_ON || command == "01") {
    lightFrontStatus = true;
    lightBackStatus = true;
    pcStatus = true;
    fanPower = true;
    digitalWrite(LED_FRONT_PIN, LOW);
    digitalWrite(LED_BACK_PIN, LOW);
    digitalWrite(PC_PIN, LOW);
    Serial.println("✅ 執行「刷進」命令: 所有設備已開啟");
    updateFanStatus();
    updateLCD();
  } else if (cmd == CMD_ALL_OFF || command == "02") {
    lightFrontStatus = false;
    lightBackStatus = false;
    pcStatus = false;
    fanPower = false;
    digitalWrite(LED_FRONT_PIN, HIGH);
    digitalWrite(LED_BACK_PIN, HIGH);
    digitalWrite(PC_PIN, HIGH);
    Serial.println("❌ 執行「刷出」命令: 所有設備已關閉");
    updateFanStatus();
    updateLCD();
  } else if (cmd == CMD_FAN_ON) {
    fanPower = true;
    Serial.println("✅ 風扇已開啟");
    updateFanStatus();
  } else if (cmd == CMD_FAN_OFF) {
    fanPower = false;
    Serial.println("❌ 風扇已關閉");
    updateFanStatus();
  } else if (cmd == CMD_FAN_TOGGLE) {
    fanPower = !fanPower;
    Serial.println(fanPower ? "✅ 風扇已開啟" : "❌ 風扇已關閉");
    updateFanStatus();
  } else if (cmd == CMD_FAN_DIR_TOGGLE) {
    fanDirection = !fanDirection;
    updateFanStatus();
  } else if (cmd == CMD_FAN_DIR_FWD) {
    fanDirection = false;
    updateFanStatus();
  } else if (cmd == CMD_FAN_DIR_REV) {
    fanDirection = true;
    updateFanStatus();
  } else if (cmd == CMD_LIGHT_FRONT_ON) {
    lightFrontStatus = true;
    digitalWrite(LED_FRONT_PIN, HIGH);
    Serial.println("✅ 電燈前段已開啟");
    updateLCD();
  } else if (cmd == CMD_LIGHT_FRONT_OFF) {
    lightFrontStatus = false;
    digitalWrite(LED_FRONT_PIN, LOW);
    Serial.println("❌ 電燈前段已關閉");
    updateLCD();
  } else if (cmd == CMD_LIGHT_BACK_ON) {
    lightBackStatus = true;
    digitalWrite(LED_BACK_PIN, HIGH);
    Serial.println("✅ 電燈後段已開啟");
    updateLCD();
  } else if (cmd == CMD_LIGHT_BACK_OFF) {
    lightBackStatus = false;
    digitalWrite(LED_BACK_PIN, LOW);
    Serial.println("❌ 電燈後段已關閉");
    updateLCD();
  } else if (cmd == CMD_PC_ON) {
    pcStatus = true;
    digitalWrite(PC_PIN, HIGH);
    Serial.println("✅ 電腦已開啟");
    updateLCD();
  } else if (cmd == CMD_PC_OFF) {
    pcStatus = false;
    digitalWrite(PC_PIN, LOW);
    Serial.println("❌ 電腦已關閉");
    updateLCD();
  } else {
    Serial.print("❓ 未知命令: ");
    Serial.println(command);
  }
}

void setup() {
  Serial.begin(115200);
  BTSerial.begin(9600, SERIAL_8N1, HC05_RX, HC05_TX);
  pinMode(LED_FRONT_PIN, OUTPUT);
  pinMode(LED_BACK_PIN, OUTPUT);
  pinMode(PC_PIN, OUTPUT);
  pinMode(FAN_IN1, OUTPUT);
  pinMode(FAN_IN2, OUTPUT);
  digitalWrite(LED_FRONT_PIN, LOW);
  digitalWrite(LED_BACK_PIN, LOW);
  digitalWrite(PC_PIN, LOW);
  digitalWrite(FAN_IN1, LOW);
  digitalWrite(FAN_IN2, LOW);
  lcd.init();
  lcd.backlight();
  lcd.setCursor(0, 0);
  lcd.print("System ready");
  lcd.setCursor(0, 1);
  lcd.print("Waiting command..");
  SPI.begin(18, 19, 23, SS_PIN);
  mfrc522.PCD_Init();
  Serial.println("🔌 系統已啟動，等待命令...");
  delay(1000);
  updateLCD();
}

void loop() {
  if (Serial.available()) {
    String command = Serial.readStringUntil('\n');
    processCommand(command);
  }
  if (BTSerial.available()) {
    String command = BTSerial.readStringUntil('\n');
    processCommand(command);
  }
  if (mfrc522.PICC_IsNewCardPresent() && mfrc522.PICC_ReadCardSerial()) {
    String uidStr = "";
    for (byte i = 0; i < mfrc522.uid.size; i++) {
      uidStr += (mfrc522.uid.uidByte[i] < 0x10 ? "0" : "");
      uidStr += String(mfrc522.uid.uidByte[i], HEX);
    }
    uidStr.toUpperCase();
    Serial.print("📡 UID: ");
    Serial.println(uidStr);
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("Card scanned:");
    lcd.setCursor(0, 1);
    lcd.print(uidStr);
    static bool toggleMode = true;
    if (toggleMode) {
      processCommand(String(CMD_ALL_ON));
      Serial.println("01");
      BTSerial.println("01");
    } else {
      processCommand(String(CMD_ALL_OFF));
      Serial.println("02");
      BTSerial.println("02");
    }
    toggleMode = !toggleMode;
    mfrc522.PICC_HaltA();
    mfrc522.PCD_StopCrypto1();
    delay(2000);
    updateLCD();
  }
}
