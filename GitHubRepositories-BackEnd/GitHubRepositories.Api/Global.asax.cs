using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Routing;
using System.Web.SessionState;

namespace GitHubRepositories.Api
{
    public class WebApiApplication : HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();  // important for using session!
            GlobalConfiguration.Configure(WebApiConfig.Register);

            // Required for Session !!!
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            RouteTable.Routes.MapHttpRoute(
                name: "ApiWithSession",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            ).RouteHandler = new SessionRouteHandler();
        }

        protected void Application_PostAuthorizeRequest()
        {
            HttpContext.Current.SetSessionStateBehavior(SessionStateBehavior.Required);
        }
    }
}
