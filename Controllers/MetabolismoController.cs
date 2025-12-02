using Microsoft.AspNetCore.Mvc;
using BEINN.Models;
using BEINN.Servicios;

namespace BEINN.Controllers
{
    [ServiceFilter(typeof(ValidacionInputFiltro))]
    [AutorizacionFiltro]
    public class Metabolismo : Controller
    {
        public IActionResult TasadeConsumoMetabolico()
        {
            return View();
        }
    }
}