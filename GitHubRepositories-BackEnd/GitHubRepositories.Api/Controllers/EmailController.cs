using System;
using System.Net.Mail;
using System.Web.Http;
using GitHubRepositories.Api.Models;

namespace GitHubRepositories.Api.Controllers
{
    [RoutePrefix("email")]
    public class EmailController : ApiController
    {
        [HttpPost]
        [Route("send")]
        public IHttpActionResult Send([FromBody] EmailRequest req)
        {
            if (req == null || string.IsNullOrWhiteSpace(req.To))
                return BadRequest("Invalid request");

            try
            {
                var body = BuildEmailBody(req.Repo);

                var message = new MailMessage();
                message.To.Add(req.To);
                message.Subject = $"Repository info: {req.Repo?.FullName ?? "Repo"}";
                message.Body = body;
                message.IsBodyHtml = true;

                // Using IIS Pickup Directory (no SMTP credentials)
                var client = new SmtpClient();
                client.DeliveryMethod = SmtpDeliveryMethod.PickupDirectoryFromIis;

                client.Send(message);

                return Ok(new { success = true });
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        private string BuildEmailBody(RepoDto repo)
        {
            if (repo == null) return "<p>No repo provided</p>";
            return $@"
                <h2>{repo.FullName}</h2>
                <p><strong>Description:</strong> {repo.Description}</p>
                <p><strong>Url:</strong> <a href='{repo.HtmlUrl}' target='_blank'>{repo.HtmlUrl}</a></p>
                <p><strong>Owner:</strong> {repo.Owner?.Login}</p>
                <p><img src='{repo.Owner?.AvatarUrl}' width='80' /></p>
            ";
        }

        public class EmailRequest
        {
            public string To { get; set; }
            public RepoDto Repo { get; set; }
        }
    }
}
