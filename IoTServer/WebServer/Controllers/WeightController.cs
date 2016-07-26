using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web.Http;

namespace WebServer.Controllers
{
    public class WeightController : Controller
    {
        public WeightController(ApplicationContext context) : base (context)
        {
        }

        public int Get()
        {
            Validate();
            return _context.Weight;
        }
    }
}
