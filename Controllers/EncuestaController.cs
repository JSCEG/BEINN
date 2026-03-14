using Microsoft.AspNetCore.Mvc;
using BEINN.Models;
using BEINN.Servicios;

namespace BEINN.Controllers
{
    [ServiceFilter(typeof(ValidacionInputFiltro))]
    [AutorizacionFiltro]
    public class EncuestaController : Controller
    {
        private readonly IEncuestaService _encuestaService;

        public EncuestaController(IEncuestaService encuestaService)
        {
            _encuestaService = encuestaService;
        }

        [HttpGet]
        public IActionResult Index()
        {
            return View(new Encuesta());
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Enviar(Encuesta encuesta)
        {
            if (!ModelState.IsValid)
            {
                return View("Index", encuesta);
            }

            await _encuestaService.GuardarAsync(encuesta);
            return RedirectToAction("Gracias");
        }

        [HttpGet]
        public IActionResult Gracias()
        {
            return View();
        }
    }
}
