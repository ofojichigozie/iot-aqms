#pragma once

// ---------------------------------------------------------------------------
// config.h — AQMS Firmware Configuration
// Edit this file before flashing. Do not modify iot-aqms-firmware.ino.
// ---------------------------------------------------------------------------

// --- WiFi -------------------------------------------------------------------
#define WIFI_SSID       "YOUR_WIFI_SSID"
#define WIFI_PASSWORD   "YOUR_WIFI_PASSWORD"

// --- Backend ----------------------------------------------------------------
// HTTPS is required for Render-hosted deployments.
#define API_BASE_URL    "https://iot-aqms.onrender.com/api/readings"

// Optional device key for backend device-auth middleware.
// Leave empty if your deployment does not require it.
#define DEVICE_ID       "NODEMCU-001"
#define DEVICE_API_KEY  ""

// --- Timing -----------------------------------------------------------------
// How often a reading is sampled and sent (milliseconds).
#define SEND_INTERVAL_MS  10000UL   // 10 seconds

// --- Hardware ---------------------------------------------------------------
// D4 = GPIO2, built-in LED on NodeMCU — active LOW.
#define LED_PIN  LED_BUILTIN
