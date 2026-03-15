using BEINN.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BEINN.Servicios.Interfaces
{
    public interface IRepositorioHome
    {
        Task<List<SeccionSistema>> ObtenerSeccionesConModulos();
        Task<List<ModuloSistema>> ObtenerModulosPorSeccion(int seccionId);
        Task<List<SeccionSistema>> ObtenerSeccionesConModulosPorRol(string rolUsuario);
    }
}
