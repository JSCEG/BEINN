using BEINN.Models;

namespace BEINN.Servicios
{
    public interface IEncuestaService
    {
        Task GuardarAsync(Encuesta encuesta);
    }

    public class EncuestaService : IEncuestaService
    {
        private readonly IRepositorioUsuarios _repositorioUsuarios;

        public EncuestaService(IRepositorioUsuarios repositorioUsuarios)
        {
            _repositorioUsuarios = repositorioUsuarios;
        }

        public async Task GuardarAsync(Encuesta encuesta)
        {
            await _repositorioUsuarios.InsertarEncuesta(encuesta);
        }
    }
}
