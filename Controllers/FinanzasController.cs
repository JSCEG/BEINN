using Microsoft.AspNetCore.Mvc;
using BEINN.Models;
using BEINN.Servicios;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BEINN.Controllers
{
    [ServiceFilter(typeof(ValidacionInputFiltro))]
    [AutorizacionFiltro]
    public class FinanzasController : Controller
    {
        private readonly IRepositorioFinanzas repositorioFinanzas;

        public FinanzasController(IRepositorioFinanzas repositorioFinanzas)
        {
            this.repositorioFinanzas = repositorioFinanzas;
        }

        // Vista principal del tablero
        public IActionResult TableroFinanciero()
        {
            return View();
        }

        // Método para obtener el tablero financiero[HttpGet]
        [HttpGet]
        [HttpGet]
        public async Task<IActionResult> ObtenerDatosFinancieros(
    int? ciclo,
    int? idUR,
    int? idCapitulo,
    string idPP,
    string tipoGasto,
    int? idEntidadFederativa)
        {
            var datos = await repositorioFinanzas.ObtenerTableroFinancieroAsync(
                ciclo, idUR, idCapitulo, idPP, tipoGasto, idEntidadFederativa);

            return Json(datos); // NO return Json(new { success = true })
        }

    }
}
