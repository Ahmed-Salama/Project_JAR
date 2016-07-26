using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web.Http;

namespace WebServer.Controllers
{
    public class WeightController : ApiController
    {
        private ApplicationContext _context;

        public WeightController(ApplicationContext context)
        {
            _context = context;
        }

        public int Get()
        {
            return _context.Weight;
        }
    }
}
