using Microsoft.AspNetCore.Mvc;
using BEINN.Servicios;
using System.Threading.Tasks;
using System.Data;

namespace BEINN.Controllers
{
    [ServiceFilter(typeof(ValidacionInputFiltro))]
    [AutorizacionFiltro]


    public class ErrorController : Controller
    {
        public IActionResult AccesoDenegado()
        {
            return View();
        }
        public IActionResult ActividadSospechosa()
        {
            return View();
        }
    }

}
