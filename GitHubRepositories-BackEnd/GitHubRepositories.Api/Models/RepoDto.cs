using Newtonsoft.Json;

namespace GitHubRepositories.Api.Models
{
    public class RepoDto
    {
        [JsonProperty("id")]
        public long Id { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("full_name")]
        public string FullName { get; set; }

        [JsonProperty("html_url")]
        public string HtmlUrl { get; set; }

        [JsonProperty("description")]
        public string Description { get; set; }

        [JsonProperty("owner")]
        public OwnerDto Owner { get; set; }
    }

    public class OwnerDto
    {
        [JsonProperty("login")]
        public string Login { get; set; }

        [JsonProperty("avatar_url")]
        public string AvatarUrl { get; set; }
    }

    public class EmailRequestDto
    {
        public string To { get; set; }
        public RepoDto Repo { get; set; }
    }

    public class IdRequest
    {
        public long Id { get; set; }
    }
}
