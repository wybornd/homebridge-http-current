# homebridge-http-temperature

Supports https devices on HomeBridge Platform.
This is a modified version of the https://github.com/lucacri/homebridge-http-temperature plugin.
This version only supports current sensors, not temp or humidity.

# Installation

1. Install homebridge using: ```npm install -g homebridge```
2. Install this plugin using: ```npm install -g homebridge-http-current```
3. Update your configuration file. See sample-config.json in this repository for a sample.

# Configuration


Configuration sample file:

 ```
 "accessories": [
     {
         "accessory": "HttpCurrent",
         "name": "Switch Current",
         "url": "http://192.168.1.127/current?format=json",
         "http_method": "GET"
     }
 ]

```


The defined endpoint will return a json looking like this
```
{
	"current": 3.7
}
```


This plugin acts as an interface between a web endpoint and homebridge only. You will still need some dedicated hardware to expose the web endpoints with the current information. In my case, I used an NodeMCU WiFi board and ACS712 current sensor.
