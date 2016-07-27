using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web.Http;

namespace WebServer.Controllers
{
    public class SimulationController : Controller
    {
        public SimulationController(ApplicationContext context) : base(context)
        {
        }

        public void Start()
        {
            _context.StartSimulation();
        }

        public void Stop()
        {
            _context.StopSimulation();
        }
    }
}
