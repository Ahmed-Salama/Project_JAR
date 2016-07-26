using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace WebServer.Controllers
{
    public class AppController : System.Web.Mvc.Controller
    {
        public ActionResult Index()
        {
            return View("index");
        }

        public ActionResult Recipe(string name)
        {
            ViewBag.Title = name;
            return View("recipe");
        }
    }
}