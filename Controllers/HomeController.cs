using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using BEINN.Models;
using BEINN.Servicios.Interfaces;
using Newtonsoft.Json;

namespace BEINN.Controllers
{
    [ServiceFilter(typeof(ValidacionInputFiltro))]
    [AutorizacionFiltro]
    public class HomeController : Controller
    {
        private readonly IRepositorioHome _repositorioHome;

        public HomeController(IRepositorioHome repositorioHome)
        {
            _repositorioHome = repositorioHome;
        }

        public async Task<IActionResult> Index(string section = null, string module = null)
        {
            var perfilUsuarioJson = HttpContext.Session.GetString("PerfilUsuario");
            var perfilUsuario = JsonConvert.DeserializeObject<PerfilUsuario>(perfilUsuarioJson);
            var rolUsuario = perfilUsuario?.Rol?.ToString() ?? string.Empty;

            var secciones = await _repositorioHome.ObtenerSeccionesConModulos();

            foreach (var seccion in secciones)
            {
                var modulosFiltrados = new List<ModuloSNIER>();

                foreach (var modulo in seccion.Modulos)
                {
                    var rolesModulo = modulo.Roles ?? string.Empty;
                    var rolesArray = rolesModulo.Split(',', StringSplitOptions.RemoveEmptyEntries)
                        .Select(r => r.Trim())
                        .ToList();

                    if (string.IsNullOrEmpty(rolesModulo) || rolesArray.Contains(rolUsuario))
                    {
                        modulosFiltrados.Add(modulo);
                    }
                }

                seccion.Modulos = modulosFiltrados;
            }

            var modelo = new HomeViewModel
            {
                PerfilUsuario = perfilUsuario,
                Secciones = secciones.Where(s => s.Modulos.Any()).ToList()
            };

            if (!string.IsNullOrEmpty(section))
            {
                ViewData["ActiveSection"] = section;
                ViewData["ActiveModule"] = module;
            }

            return View(modelo);
        }

        public IActionResult Privacy()
        {
            return View();
        }

        public IActionResult EnConstruccion()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
