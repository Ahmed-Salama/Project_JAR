using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebServer
{
    public class ApplicationContext
    {
        public int Temperature { get; set; }
        public int Weight { get; set; }

        private Queue<Exception> ExceptionsRaised;

        public ApplicationContext()
        {
            ExceptionsRaised = new Queue<Exception>();
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
    }
}