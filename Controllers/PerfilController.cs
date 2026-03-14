using Microsoft.AspNetCore.Mvc;
using BEINN.Models;
using BEINN.Servicios;
using Newtonsoft.Json;

namespace BEINN.Controllers
{
    [ServiceFilter(typeof(ValidacionInputFiltro))]
    [AutorizacionFiltro]
    public class PerfilController : Controller
    {
        private readonly IRepositorioUsuarios _repositorioUsuarios;

        public PerfilController(IRepositorioUsuarios repositorioUsuarios)
        {
            _repositorioUsuarios = repositorioUsuarios;
        }

        [HttpGet]
        public async Task<IActionResult> MiPerfil(int? id)
        {
            var perfilUsuarioJson = HttpContext.Session.GetString("PerfilUsuario");
            if (string.IsNullOrWhiteSpace(perfilUsuarioJson))
            {
                return RedirectToAction("SesionExpirada", "Acceso");
            }

            var perfilSesion = JsonConvert.DeserializeObject<PerfilUsuario>(perfilUsuarioJson);
            var usuarioId = id ?? int.Parse(perfilSesion.IdUsuario);

            var user = await _repositorioUsuarios.ObtenerUsuarioPorId(usuarioId);
            if (user == null)
            {
                return NotFound();
            }

            var model = new MiPerfilViewModel
            {
                IdUsuario = user.IdUsuario,
                Nombre = user.Nombre,
                Correo = user.Correo,
                RFC = user.RFC,
                Cargo = user.Cargo,
                UnidadDeAdscripcion = user.Unidad_de_Adscripcion,
                ClaveEmpleado = user.ClaveEmpleado,
                SesionActiva = user.SesionActiva,
                Vigente = user.Vigente,
                RolNombre = user.Rol_Nombre,
                MercadoNombre = user.Mercado_Nombre
            };

            return View(model);
        }
    }
}
