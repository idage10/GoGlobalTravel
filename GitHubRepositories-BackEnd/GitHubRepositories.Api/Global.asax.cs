using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Routing;

namespace GitHubRepositories.Api
{
    public class WebApiApplication : HttpApplication
    {
        protected void Application_Start()
        {
            GlobalConfiguration.Configure(WebApiConfig.Register);
        }
    }
}
