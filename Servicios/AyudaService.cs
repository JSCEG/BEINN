using BEINN.Models;

namespace BEINN.Servicios
{
    public interface IAyudaService
    {
        Task<AyudaViewModel> ObtenerAyudaAsync();
    }

    public class AyudaService : IAyudaService
    {
        public Task<AyudaViewModel> ObtenerAyudaAsync()
        {
            return Task.FromResult(new AyudaViewModel());
        }
    }
}
