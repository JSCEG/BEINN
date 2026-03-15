using Microsoft.Extensions.Configuration;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text.Json;
using System.Threading.Tasks;
using BEINN.Models;

namespace BEINN.Servicios
{
    public interface IRepositorioChat
    {
        Task<string> AskGPTAsync(string prompt);
    }

    public class RepositorioChat : IRepositorioChat
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiKey;
        public RepositorioChat(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _apiKey = configuration["OpenAI:ApiKey"];
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _apiKey);
        }

        public async Task<string> AskGPTAsync(string prompt)
        {
            var requestData = new
            {
                model = "gpt-3.5-turbo",
                messages = new[]
                {
                    new { role = "user", content = prompt }
                }
            };

            var response = await _httpClient.PostAsJsonAsync("chat/completions", requestData);

            if (response.IsSuccessStatusCode)
            {
                var responseContent = await response.Content.ReadAsStringAsync();
                var options = new JsonSerializerOptions
                {
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                    PropertyNameCaseInsensitive = true,
                };
                var result = JsonSerializer.Deserialize<OpenAIChatResponse>(responseContent, options);

                return result?.Choices?[0].Message?.Content.Trim();
            }
            else
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                throw new HttpRequestException($"Error al solicitar a OpenAI: {response.ReasonPhrase}, Respuesta: {errorContent}");
            }
        }

    }

    public class OpenAIChatResponse
    {
        public Choice[] Choices { get; set; }
    }

    public class Choice
    {
        public Message Message { get; set; }
    }

    public class Message
    {
        public string Content { get; set; }
    }
}
