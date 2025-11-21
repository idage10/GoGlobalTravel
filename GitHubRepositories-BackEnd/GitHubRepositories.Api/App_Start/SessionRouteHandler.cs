using System.Web;
using System.Web.Http.WebHost;
using System.Web.Routing;
using System.Web.SessionState;

public class SessionRouteHandler : HttpControllerRouteHandler
{
    protected override IHttpHandler GetHttpHandler(RequestContext requestContext)
    {
        return new SessionControllerHandler(requestContext.RouteData);
    }
}

public class SessionControllerHandler : HttpControllerHandler, IRequiresSessionState
{
    public SessionControllerHandler(RouteData routeData) : base(routeData)
    {
    }
}
