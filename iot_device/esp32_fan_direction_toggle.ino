#include <SPI.h>
#include <Adafruit_NeoPixel.h>
#include <MFRC522.h>
#include <HardwareSerial.h>
#include <LiquidCrystal_I2C.h>
// RFID 腳位
#define SS_PIN 5
#define RST_PIN 4
MFRC522 mfrc522(SS_PIN, RST_PIN);
LiquidCrystal_I2C lcd(0x27, 16, 2);
// HC-05 UART
#define HC05_RX 16
#define HC05_TX 17
HardwareSerial BTSerial(1);
bool toggleState = true; // 記錄目前狀態

// L298N 控制腳位
#define IN1 26  // 控制方向1
#define IN2 27  // 控制方向2
#define TOGGLE_PIN 2  // 控制風扇啟動（PWM or HIGH）


#define LED_PIN     13     // 接到資料線的腳位（可改）
#define LED_COUNT   8      // 總共 8 顆燈

Adafruit_NeoPixel strip(LED_COUNT, LED_PIN, NEO_GRB + NEO_KHZ800);
bool fanDirection = false;  // false = 順轉, true = 反轉

void setup() {
  Serial.begin(115200);
  BTSerial.begin(9600, SERIAL_8N1, HC05_RX, HC05_TX);
  pinMode(TOGGLE_PIN, OUTPUT);
  digitalWrite(TOGGLE_PIN, HIGH);
  // L298N 腳位
  pinMode(IN1, OUTPUT);
  pinMode(IN2, OUTPUT);

  // 預設風扇關閉
  digitalWrite(IN1, LOW);
  digitalWrite(IN2, LOW);
  // LCD 初始化
  lcd.init();
  lcd.backlight();
  lcd.setCursor(0, 0);
  lcd.print("Waiting for card..");
  strip.begin();
  strip.setBrightness(150); // 可調 0～255（越高越亮）
  for (int i = 0; i < LED_COUNT; i++) {
    strip.setPixelColor(i, strip.Color(255, 255, 255)); // 白光，可改色
  }
  strip.show(); // 顯示設定
  
  SPI.begin(18, 19, 23, SS_PIN);  
  mfrc522.PCD_Init();

  Serial.println("🎫 請刷卡切換風扇方向");
}

void loop() {
  if (!mfrc522.PICC_IsNewCardPresent() || !mfrc522.PICC_ReadCardSerial()) return;
    toggleState = !toggleState;

  // 讀 UID
  String uidStr = "";
  for (byte i = 0; i < mfrc522.uid.size; i++) {
    uidStr += (mfrc522.uid.uidByte[i] < 0x10 ? "0" : "");
    uidStr += String(mfrc522.uid.uidByte[i], HEX);
  }
  uidStr.toUpperCase();

  Serial.print("📡 UID: ");
  Serial.println(uidStr);
  // 顯示刷卡成功
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("scan complete");
  lcd.setCursor(0, 1);
  lcd.print(uidStr);
  BTSerial.println("01");
  digitalWrite(TOGGLE_PIN, toggleState ? HIGH : LOW);
  delay(1000);  // 顯示 2 秒

  // 還原顯示狀態
  
  // 🔁 切換風扇方向
  fanDirection = !fanDirection;
  if (fanDirection) {
    // 反轉
    digitalWrite(IN1, HIGH);
    digitalWrite(IN2, LOW);
    Serial.println("🌀 風扇方向：反轉");
  } else {
    // 順轉
    digitalWrite(IN1, LOW);
    digitalWrite(IN2, LOW);
    Serial.println("🌀關閉");
  }

  mfrc522.PICC_HaltA();
  mfrc522.PCD_StopCrypto1();
  delay(2000); // 防止重複刷卡
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Waiting for card.."); 
  
}
