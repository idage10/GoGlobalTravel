using System;
using System.Net.Mail;
using System.Web;
using System.Web.Http;
using GitHubRepositories.Api.Models;

namespace GitHubRepositories.Api.Controllers
{
    [RoutePrefix("email")]
    public class EmailController : ApiController
    {
        [HttpPost]
        [Route("send")]
        public IHttpActionResult Send([FromBody] EmailRequestDto req)
        {
            if (req == null || string.IsNullOrWhiteSpace(req.To))
                return BadRequest("Invalid request");

            try
            {
                var body = BuildEmailBody(req.Repo);

                var message = new MailMessage();
                message.From = new MailAddress("noreply@myapp.com");
                message.To.Add(req.To);
                message.Subject = $"Repository info: {req.Repo?.FullName ?? "Repo"}";
                message.Body = body;
                message.IsBodyHtml = true;

                // Set the location folder where the email file will be saved (instead of sending real email using credentials).
                // The email file will be saved in the visual studio project folder under: /App_Data/Emails
                var client = new SmtpClient
                {
                    DeliveryMethod = SmtpDeliveryMethod.SpecifiedPickupDirectory,
                    PickupDirectoryLocation = HttpContext.Current.Server.MapPath("~/App_Data/Emails")
                };

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
            ";
        }
    }
}
