using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using GitHubRepositories.Api.Models;

namespace GitHubRepositories.Api.Controllers
{
    [RoutePrefix("gitbookmarks")]
    public class BookmarksController : ApiController
    {
        private const string SessionKey = "bookmarks";

        private List<RepoDto> GetBookmarksFromSession()
        {
            var session = HttpContext.Current.Session;
            if (session[SessionKey] == null)
            {
                session[SessionKey] = new List<RepoDto>();
            }
            return session[SessionKey] as List<RepoDto>;
        }

        [HttpPost]
        [Route("add")]
        public IHttpActionResult Add([FromBody] RepoDto repo)
        {
            if (repo == null || repo.Id == 0)
                return BadRequest("Invalid repo payload.");

            var list = GetBookmarksFromSession();
            if (!list.Any(r => r.Id == repo.Id))
            {
                list.Add(repo);
            }

            return Ok(list);
        }

        [HttpGet]
        [Route("list")]
        public IHttpActionResult List()
        {
            var list = GetBookmarksFromSession();
            return Ok(list);
        }

        [HttpPost]
        [Route("remove")]
        public IHttpActionResult Remove([FromBody] IdRequest req)
        {
            if (req == null) return BadRequest("Invalid request.");
            var list = GetBookmarksFromSession();
            var existing = list.FirstOrDefault(r => r.Id == req.Id);
            if (existing != null)
            {
                list.Remove(existing);
            }
            return Ok(list);
        }
    }
}
