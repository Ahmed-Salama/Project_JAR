using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using System.Web.Routing;

namespace WebServer.App_Start
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            // ignore these routes because they cause server exceptions - not sure where they come from
            routes.IgnoreRoute("Piccadilly/_layouts/listfeed.aspx");
            routes.IgnoreRoute("obd/_layouts/listfeed.aspx");

            routes.MapMvcAttributeRoutes();

            // Allow the template controller to handle requests to existing cshtml files
            routes.RouteExistingFiles = true;
                        
            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "App", action = "Index", id = UrlParameter.Optional });
        }

    }
}