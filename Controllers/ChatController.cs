using Microsoft.AspNetCore.Mvc;
using BEINN.Servicios;

namespace BEINN.Controllers
{
    [ServiceFilter(typeof(ValidacionInputFiltro))]
    [AutorizacionFiltro]
    public class ChatController : Controller
    {
        private readonly IChatService _chatService;

        public ChatController(IChatService chatService)
        {
            _chatService = chatService;
        }

        public IActionResult Asistente()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Ask(string prompt)
        {
            if (string.IsNullOrWhiteSpace(prompt))
            {
                return View("Asistente", model: "Por favor, ingrese algo para preguntar.");
            }

            var response = await _chatService.PreguntarAsync(prompt);
            return View("Asistente", model: response);
        }
    }
}
