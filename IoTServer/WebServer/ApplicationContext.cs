using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WebServer.Models;

namespace WebServer
{
    public class ApplicationContext
    {
        public int Temperature { 
            get {
                if (SimulationStartTime == null)
                {
                    return temperature;
                }
                else
                {
                    return GetLastKeyframe(TemperatureSimulationEvents).Value;
                }
            } set {
                temperature = value;
            }
        }

        public int Weight
        {
            get
            {
                if (SimulationStartTime == null)
                {
                    return weight;
                }
                else
                {
                    return GetLastKeyframe(WeightSimulationEvents).Value;
                }
            }
            set
            {
                weight = value;
            }
        }

        private int temperature;
        private int weight;

        private Queue<Exception> ExceptionsRaised;

        private DateTime? SimulationStartTime;
        private List<Keyframe> TemperatureSimulationEvents;
        private List<Keyframe> WeightSimulationEvents;

        public ApplicationContext()
        {
            ExceptionsRaised = new Queue<Exception>();

            // Dummy simulation data
            WeightSimulationEvents = new List<Keyframe>();
            for (int i = 0; i < 10; i++)
            {
                WeightSimulationEvents.Add(new Keyframe(TimeSpan.FromMilliseconds(i * 200), i*50));
            }
            WeightSimulationEvents.Add(new Keyframe(TimeSpan.FromMilliseconds(10 * 200), 0));
            
            TemperatureSimulationEvents = new List<Keyframe>() { 
                new Keyframe(TimeSpan.FromSeconds(0), 0),
                new Keyframe(TimeSpan.FromSeconds(40), 10),
                new Keyframe(TimeSpan.FromSeconds(45), 20),
                new Keyframe(TimeSpan.FromSeconds(50), 50),
                new Keyframe(TimeSpan.FromSeconds(70), 70),
                new Keyframe(TimeSpan.FromSeconds(90), 120),
                new Keyframe(TimeSpan.FromSeconds(95), 70),
                new Keyframe(TimeSpan.FromMinutes(140), 0)
            };
        }

        private object _sync = new object();

        public void AddException(Exception ex)
        {
            lock (_sync)
            {
                ExceptionsRaised.Enqueue(ex);

                if (ExceptionsRaised.Count > 10) ExceptionsRaised.Dequeue();
            }
        }

        public void CheckExceptionsRaised()
        {
            if (ExceptionsRaised.Any())
            {
                string exceptionsMessage = GetExceptionsMessage();
                ResetExceptions();

                throw new InvalidOperationException(exceptionsMessage);
            }
        }

        public void StartSimulation()
        {
            SimulationStartTime = DateTime.UtcNow;
        }

        public void StopSimulation()
        {
            SimulationStartTime = null;
        }

        private void ResetExceptions()
        {
            lock (_sync)
            {
                ExceptionsRaised.Clear();
            }
        }

        private string GetExceptionsMessage()
        {
            return string.Format("Got exceptions reading from event hub: {0}", string.Join(",", ExceptionsRaised));
        }

        private Keyframe GetLastKeyframe(List<Keyframe> events)
        {
            TimeSpan? eventTime = DateTime.UtcNow - SimulationStartTime;
            return events.Last(e => e.Time < eventTime);
        }
    }
}