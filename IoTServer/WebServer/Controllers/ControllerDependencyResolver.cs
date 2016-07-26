using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http.Dependencies;
using System.Web.Http;

namespace WebServer.Controller
{
    public class ControllerDependencyResolver : IDependencyResolver
    {
        private ApplicationContext _context;

        public ControllerDependencyResolver(ApplicationContext context)
        {
            _context = context;
        }

        public IDependencyScope BeginScope()
        {
            return new ControllerDependencyResolver(_context);
        }

        public object GetService(Type serviceType)
        {
            if (serviceType == null)
            {
                return null;
            }

            if (typeof(ApiController).IsAssignableFrom(serviceType))
            {
                return Activator.CreateInstance(serviceType, _context);
            }
            else
            {
                return null;
            }
        }

        public IEnumerable<object> GetServices(Type serviceType)
        {
            return new List<object>();
        }

        public void Dispose()
        {
        }
    }
}
