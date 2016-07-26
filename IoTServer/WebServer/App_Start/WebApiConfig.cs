using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;

namespace WebServer
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config, ApplicationContext context)
        {
            // Web API configuration and services

            // Web API routes
            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}",
                defaults: new { id = RouteParameter.Optional }
            );

            config.Routes.MapHttpRoute(
                name: "ActionApi",
                routeTemplate: "api/{controller}/{action}",
                defaults: new { id = RouteParameter.Optional }
            );

            config.DependencyResolver = new Controller.ControllerDependencyResolver(context);
        }
    }
}
