var SerialPort = require("serialport");
var port = new SerialPort("/dev/cu.usbmodem1411", {
  parser: SerialPort.parsers.readline('\n')
});

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
      clearInterval(sendInterval);
      client.removeAllListeners();
      client.open(connectCallback);
    });

    port.on('data', function (data) {
        // Create a message and send it to the IoT Hub every second
        var d = JSON.stringify({ DeviceId: "FSR", Weight: data, EventTime: new Date().getTime() });
        var message = new Message(d);
        console.log('Sending message: ' + message.getData());
        client.sendEvent(message, printResultFor('send'));
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