using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web.Http;

namespace WebServer.Controllers
{
    public class Controller : ApiController
    {
        protected ApplicationContext _context;

        public Controller(ApplicationContext context)
        {
            _context = context;
        }

        public void Validate()
        {
            _context.CheckExceptionsRaised();
        }
    }
}