using Microsoft.AspNetCore.Mvc;
using BEINN.Servicios;
using System.Threading.Tasks;

namespace BEINN.Componentes
{
    public class VisitasViewComponent : ViewComponent
    {
        private readonly IRepositorioAcceso _repositorioAcceso;

        public VisitasViewComponent(IRepositorioAcceso repositorioAcceso)
        {
            _repositorioAcceso = repositorioAcceso;
        }

        public async Task<IViewComponentResult> InvokeAsync()
        {
            var totalVisitas = _repositorioAcceso.ObtenerTotalVisitas();
            return View(totalVisitas);
        }
    }
}
