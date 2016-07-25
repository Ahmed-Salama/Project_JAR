// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

#include <ESP8266WiFi.h>
#include <time.h>
#include "command_center_http.h"


const char ssid[] = "Andy"; //  WiFi SSID (name)
const char pass[] = "jarjarjar";    // WiFi password
const char connectionString[] = "HostName=jar-iot-labs.azure-devices.net;DeviceId=ESP8266;SharedAccessKey=Tk9esMCeTYQnqmljNjkMyiuiPpKHKsL5Tx25RBhUaSg=";

int status = WL_IDLE_STATUS;

///////////////////////////////////////////////////////////////////////////////////////////////////
void setup() {
    initSerial();
    initWifi();
    initTime();

    // Connected, now do something
    run();
}

///////////////////////////////////////////////////////////////////////////////////////////////////
void loop() {
  // Not used.
}

///////////////////////////////////////////////////////////////////////////////////////////////////
void initSerial() {
    // Start serial and initialize stdout
    Serial.begin(115200);
    Serial.setDebugOutput(true);
}

///////////////////////////////////////////////////////////////////////////////////////////////////
void initWifi() {
    // Attempt to connect to Wifi network:
    Serial.print("Attempting to connect to SSID: ");
    Serial.println(ssid);

    // Connect to WPA/WPA2 network. Change this line if using open or WEP network:
    status = WiFi.begin(ssid, pass);

    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }

    Serial.println("Connected to wifi");
}

///////////////////////////////////////////////////////////////////////////////////////////////////
void initTime() {
    time_t epochTime;

    configTime(0, 0, "pool.ntp.org", "time.nist.gov");

    while (true) {
        epochTime = time(NULL);

        if (epochTime == 0) {
            Serial.println("Fetching NTP epoch time failed! Waiting 2 seconds to retry.");
            delay(2000);
        } else {
            Serial.print("Fetched NTP epoch time is: ");
            Serial.println(epochTime);
            break;
        }
    }
}

