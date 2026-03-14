using Microsoft.AspNetCore.Mvc;
using BEINN.Servicios;

namespace BEINN.Controllers
{
    [ServiceFilter(typeof(ValidacionInputFiltro))]
    [AutorizacionFiltro]
    public class AyudaController : Controller
    {
        private readonly IAyudaService _ayudaService;

        public AyudaController(IAyudaService ayudaService)
        {
            _ayudaService = ayudaService;
        }

        public async Task<IActionResult> Index()
        {
            var model = await _ayudaService.ObtenerAyudaAsync();
            return View(model);
        }
    }
}
