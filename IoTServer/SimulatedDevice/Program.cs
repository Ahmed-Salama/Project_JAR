using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Azure.Devices.Client;
using Newtonsoft.Json;

namespace SimulatedDevice
{
    public class Program
    {
        static DeviceClient deviceClient;
        static string iotHubUri = "jar-iot-labs.azure-devices.net";
        static string deviceKey = "PejIBr1a8GOD7jhVshpQf7e8LUmIyHBMB4lHh1l457s=";

        static void Main(string[] args)
        {
            Console.WriteLine("Simulated device\n");
            deviceClient = DeviceClient.Create(iotHubUri, new DeviceAuthenticationWithRegistrySymmetricKey("myFirstDevice", deviceKey));

            SendDeviceToCloudMessagesAsync();
            Console.ReadLine();
        }

        private static async void SendDeviceToCloudMessagesAsync()
        {
            double avgValue = 10; // m/s
            Random rand = new Random();

            while (true)
            {
                double currentReading = avgValue + rand.NextDouble() * 4 - 2;

                var telemetryDataPoint = new
                {
                    DeviceId = "myFirstDevice",
                    Weight = currentReading
                };

                var messageString = JsonConvert.SerializeObject(telemetryDataPoint);
                var message = new Message(Encoding.ASCII.GetBytes(messageString));

                await deviceClient.SendEventAsync(message);
                Console.WriteLine("{0} > Sending message: {1}", DateTime.Now, messageString);

                Task.Delay(1000).Wait();
            }
        }
    }
}
