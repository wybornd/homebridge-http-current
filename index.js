var Service, Characteristic;
var request = require('request');

const DEF_MIN_CURRENT = -100,
      DEF_MAX_CURRENT = 100,
      DEF_TIMEOUT = 5000;

module.exports = function (homebridge) {
   Service = homebridge.hap.Service;
   Characteristic = homebridge.hap.Characteristic;
   homebridge.registerAccessory("homebridge-http-current", "HttpCurrent", HttpCurrent);
}


function HttpCurrent(log, config) {
   this.log = log;

   // url info
   this.url = config["url"];
   this.http_method = config["http_method"] || "GET";
   this.name = config["name"];
   this.manufacturer = config["manufacturer"] || "@deano manufacturer";
   this.model = config["model"] || "Model not available";
   this.serial = config["serial"] || "Non-defined serial";
   this.timeout = config["timeout"] || DEF_TIMEOUT;
   this.minCurrent = config["min_curr"] || DEF_MIN_CURRENT;
   this.maxCurrent = config["max_curr"] || DEF_MAX_CURRENT;
}


HttpCurrent.prototype = {

   getState: function (callback) {
      var ops = {
         uri:    this.url,
         method: this.http_method,
         timeout: this.timeout
      };
      this.log('Requesting current on "' + ops.uri + '", method ' + ops.method);
      request(ops, (error, res, body) => {
         var value = null;
         if (error) {
            this.log('HTTP bad response (' + ops.uri + '): ' + error.message);
         } else {
            try {
               value = JSON.parse(body).current;
               if (value < this.minCurrent || value > this.maxCurrent || isNaN(value)) {
                  throw "Invalid value received";
               }
               this.log('HTTP successful response: ' + body);
            } catch (parseErr) {
               this.log('Error processing received information: ' + parseErr.message);
               error = parseErr;
            }
         }
         callback(error, value);
      });
   },

   getServices: function () {
      this.informationService = new Service.AccessoryInformation();
      this.informationService
      .setCharacteristic(Characteristic.Manufacturer, this.manufacturer)
      .setCharacteristic(Characteristic.Model, this.model)
      .setCharacteristic(Characteristic.SerialNumber, this.serial);

      this.currentService = new Service.CurrentSensor(this.name);
      this.currentService
         .getCharacteristic(Characteristic.CurrentCurrent)
         .on('get', this.getState.bind(this))
         .setProps({
             minValue: this.minCurrent,
             maxValue: this.maxCurrent
         });
      return [this.informationService, this.currentService];
   }
};
