using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Routing;
using Microsoft.ServiceBus.Messaging;
using System.Threading;
using System.Threading.Tasks;
using System.Text;
using Newtonsoft.Json;
using Newtonsoft;
using WebServer.Models;

namespace WebServer
{
    public class WebApiApplication : System.Web.HttpApplication
    {
        static string connectionString = "Endpoint=sb://jar-event-hub-ns.servicebus.windows.net/;SharedAccessKeyName=readwrite;SharedAccessKey=oeBBdhJ0h6LIgnO7BK+0fAUaMvCkyh9DITNHVw0+QKQ=";
        static string connectionPath = "jar-event-hub";
        static EventHubClient eventHubClient;
        ApplicationContext applicationContext;

        protected void Application_Start()
        {
            applicationContext = new ApplicationContext();

            GlobalConfiguration.Configure((config) => 
            {
                WebApiConfig.Register(config, applicationContext);
            });

            InitializeEventHubConnection();
        }

        private void InitializeEventHubConnection()
        {
            eventHubClient = EventHubClient.CreateFromConnectionString(connectionString, connectionPath);

            var d2cPartitions = eventHubClient.GetRuntimeInformation().PartitionIds;

            CancellationTokenSource cts = new CancellationTokenSource();

            var tasks = new List<Task>();
            foreach (string partition in d2cPartitions)
            {
                tasks.Add(ReceiveMessagesFromDeviceAsync(partition, cts.Token));
            }
        }

        private async Task ReceiveMessagesFromDeviceAsync(string partition, CancellationToken ct)
        {
            var eventHubReceiver = eventHubClient.GetDefaultConsumerGroup().CreateReceiver(partition, DateTime.UtcNow - TimeSpan.FromDays(7));
            while (true)
            {
                if (ct.IsCancellationRequested) break;
                EventData eventData = await eventHubReceiver.ReceiveAsync();
                if (eventData == null) continue;

                string data = Encoding.UTF8.GetString(eventData.GetBytes());

                List<Event> events = data.Split(new char[] {'\r', '\n'}, StringSplitOptions.RemoveEmptyEntries).Select(raw => JsonConvert.DeserializeObject<Event>(raw)).ToList();

                List<Event> temperatureEvents = events.Where(e => e.TemperatureReading != null).ToList();
                List<Event> weightEvents = events.Where(e => e.WeightReading != null).ToList();

                if (temperatureEvents.Any()) applicationContext.Temperature = int.Parse(temperatureEvents.Last().TemperatureReading);
                if (weightEvents.Any()) applicationContext.Weight = int.Parse(weightEvents.Last().WeightReading);
                
                Console.WriteLine("Message received. Partition: {0} Data: '{1}'", partition, data);
            }
        }
    }
}
