using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebServer.Models
{
    public class Event
    {
        public string DeviceId { get; set; }

        public string WeightReading { get; set; }

        public string TemperatureReading { get; set; }
    }
}