using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebServer.Models
{
    public class Keyframe
    {
        public TimeSpan Time { get; set; }
        public int Value { get; set; }

        public Keyframe(TimeSpan time, int value)
        {
            Time = time;
            Value = value;
        }
    }
}