using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebServer.Models
{
    public class TemperatureEvent : Event
    {
        public string Temperature { get; set; }
    }
}