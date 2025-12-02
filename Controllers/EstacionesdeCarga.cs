using Microsoft.AspNetCore.Mvc;
using BEINN.Servicios;
using System.Threading.Tasks;
using System.Data;

namespace BEINN.Controllers
{
    [ServiceFilter(typeof(ValidacionInputFiltro))]
    [AutorizacionFiltro]


    public class EstacionesdeCarga : Controller
    {
        public IActionResult Electrolineras()
        {
            return View();
        }
    }

}
