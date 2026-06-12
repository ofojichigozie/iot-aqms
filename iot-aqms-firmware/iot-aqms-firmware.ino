/*
 * AQMS Firmware — ESP8266 NodeMCU
 * Air Quality Monitoring System
 *
 * Hardware:
 *   - ESP8266 NodeMCU
 *   - MQ135 gas sensor  → Analog pin A0
 *   - Status LED        → GPIO LED_BUILTIN / D4 (active LOW)
 *
 * Libraries required (install via Arduino Library Manager):
 *   - ESP8266WiFi        (bundled with ESP8266 board package)
 *   - ESP8266HTTPClient  (bundled with ESP8266 board package)
 *   - ArduinoJson        (by Benoit Blanchon, v6.x)
 */

#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClientSecure.h>
#include <ArduinoJson.h>
#include "config.h"

// ---------------------------------------------------------------------------
// Globals
// ---------------------------------------------------------------------------

WiFiClientSecure wifiClient;
unsigned long    lastSendTime = 0;

// ---------------------------------------------------------------------------
// LED
//
// The LED convention throughout this firmware:
//   Steady ON  → system is running normally
//   Blinking   → activity (connecting, sending)
//   OFF        → transient / never left in this state intentionally
//
// Active-LOW reminder: digitalWrite LOW turns the LED on, HIGH turns it off.
//
// blinkLed() always restores steady-ON on exit so callers never need to
// think about LED state after calling it.
// ---------------------------------------------------------------------------

/**
 * Blink the status LED a given number of times, then restore steady-ON.
 *
 * @param count    Number of blink cycles.
 * @param delayMs  Duration (ms) of each ON and each OFF phase.
 */
void blinkLed(int count, int delayMs) {
  for (int i = 0; i < count; i++) {
    digitalWrite(LED_PIN, HIGH);  // OFF
    delay(delayMs);
    digitalWrite(LED_PIN, LOW);   // ON
    delay(delayMs);
  }
  digitalWrite(LED_PIN, LOW);     // Restore steady-ON
}

// ---------------------------------------------------------------------------
// WiFi
// ---------------------------------------------------------------------------

void setupWifi() {
  Serial.print("[WiFi] Connecting to ");
  Serial.println(WIFI_SSID);

  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  while (WiFi.status() != WL_CONNECTED) {
    blinkLed(1, 250);             // Slow blink while connecting
    Serial.print(".");
  }

  Serial.println();
  Serial.print("[WiFi] Connected. IP: ");
  Serial.println(WiFi.localIP());

  digitalWrite(LED_PIN, LOW);     // Steady-ON once connected
}

void reconnectWifi() {
  if (WiFi.status() == WL_CONNECTED) return;

  Serial.println("[WiFi] Connection lost. Reconnecting...");
  WiFi.disconnect();
  delay(1000);
  setupWifi();
}

// ---------------------------------------------------------------------------
// Sensor
// ---------------------------------------------------------------------------

int readSensor() {
  int raw = analogRead(A0);       // MQ135 on A0 (0–1023)
  Serial.print("[Sensor] Raw ADC value: ");
  Serial.println(raw);
  return raw;
}

// ---------------------------------------------------------------------------
// HTTP POST
// ---------------------------------------------------------------------------

void sendReading(int sensorValue) {
  StaticJsonDocument<128> doc;
  doc["deviceId"]    = DEVICE_ID;
  doc["sensorValue"] = sensorValue;

  char payload[128];
  serializeJson(doc, payload);

  Serial.print("[HTTP] POST → ");
  Serial.println(API_BASE_URL);
  Serial.print("[HTTP] Payload: ");
  Serial.println(payload);

  wifiClient.setInsecure();
  HTTPClient http;
  http.begin(wifiClient, API_BASE_URL);
  http.setTimeout(10000);
  http.addHeader("Content-Type", "application/json");

  if (DEVICE_API_KEY[0] != '\0') {
    http.addHeader("X-Device-Key", DEVICE_API_KEY);
  }

  blinkLed(3, 100);               // Fast triple-blink = sending data

  int httpCode = http.POST(payload);

  if (httpCode > 0) {
    Serial.print("[HTTP] Response code: ");
    Serial.println(httpCode);

    if (httpCode == HTTP_CODE_CREATED || httpCode == HTTP_CODE_OK) {
      Serial.println("[HTTP] Reading accepted by server.");
    } else {
      Serial.print("[HTTP] Server response: ");
      Serial.println(http.getString());
    }
  } else {
    Serial.print("[HTTP] Request failed: ");
    Serial.println(http.errorToString(httpCode));
  }

  http.end();
}

// ---------------------------------------------------------------------------
// Arduino lifecycle
// ---------------------------------------------------------------------------

void setup() {
  Serial.begin(115200);
  delay(500);

  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN, HIGH);    // LED off during boot

  Serial.println("\n=== AQMS Firmware Starting ===");
  setupWifi();
  // LED is left steady-ON by setupWifi()
}

void loop() {
  reconnectWifi();

  unsigned long now = millis();
  if (now - lastSendTime >= SEND_INTERVAL_MS) {
    lastSendTime = now;
    sendReading(readSensor());
  }
}
