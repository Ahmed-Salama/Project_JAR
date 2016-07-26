var express = require("express");
var app = express();

// setup IoT hub.
var Protocol = require('azure-iot-device-amqp').Amqp;
var Client = require('azure-iot-device').Client;
var Message = require('azure-iot-device').Message;
var connectionString = 'HostName=jar-iot-labs.azure-devices.net;DeviceId=ESP8266;SharedAccessKey=Tk9esMCeTYQnqmljNjkMyiuiPpKHKsL5Tx25RBhUaSg=';

// fromConnectionString must specify a transport constructor, coming from any transport package.
var client = Client.fromConnectionString(connectionString, Protocol);

var connectCallback = function (err) {
  if (err) {
    console.error('Could not connect: ' + err.message);
  } else {
    console.log('Client connected');
    client.on('message', function (msg) {
      console.log('Id: ' + msg.messageId + ' Body: ' + msg.data);
      client.complete(msg, printResultFor('completed'));
      // reject and abandon follow the same pattern.
      // /!\ reject and abandon are not available with MQTT
    });

    client.on('error', function (err) {
      console.error(err.message);
    });

    client.on('disconnect', function () {
      client.removeAllListeners();
      client.open(connectCallback);
    });
  }
};

client.open(connectCallback);

// Helper function to print results in the console
function printResultFor(op) {
  return function printResult(err, res) {
    if (err) console.log(op + ' error: ' + err.toString());
    if (res) console.log(op + ' status: ' + res.constructor.name);
  };
}

app.get("/weight", function(request, response) {
    var deviceId = request.query.deviceId;
    var data = request.query.data;
    var eventTime = new Date().getTime();

    if (deviceId != null && data != null) {
        var content = JSON.stringify({
            DeviceId: deviceId,
            Weight: data,
            EventTime: eventTime
        });
        var msg = new Message(content);
        console.log('Sending message: ' + msg.getData());
        client.sendEvent(msg, printResultFor("send"));
    }

    response.end();
});

app.get("/temperature", function(request, response) {
    var deviceId = request.query.deviceId;
    var data = request.query.data;
    var eventTime = new Date().getTime();

    if (deviceId != null && data != null) {
        var content = JSON.stringify({
            DeviceId: deviceId,
            Temperature: data,
            EventTime: eventTime
        });
        var msg = new Message(content);
        console.log('Sending message: ' + msg.getData());
        client.sendEvent(msg, printResultFor("send"));
    }

    response.end();
});

app.listen(3000);