using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebServer.Models
{
    public class Event
    {
        public string DeviceId { get; set; }

        public long EventTime { get; set; }

        public int WeightReading { get; set; }

        public int TemperatureReading { get; set; }
    }
}