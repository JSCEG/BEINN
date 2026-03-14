using System.Data;
using BEINN.Models;

namespace BEINN.Servicios
{
    public interface IChatService
    {
        Task<string> PreguntarAsync(string prompt);
        Task<string> PreguntarVisitasAsync(string prompt);
        Task<DataTable> EjecutarConsultaAsync(string consultaSql);
        Task<ConsultaNaturalViewModel> EjecutarConsultaNaturalAsync(string pregunta);
    }

    public class ChatService : IChatService
    {
        private readonly IRepositorioChat _repositorioChat;

        public ChatService(IRepositorioChat repositorioChat)
        {
            _repositorioChat = repositorioChat;
        }

        public Task<string> PreguntarAsync(string prompt)
        {
            return _repositorioChat.AskGPTAsync(prompt);
        }

        public Task<string> PreguntarVisitasAsync(string prompt)
        {
            return _repositorioChat.AskVisitasdeVerificaciónAsync(prompt);
        }

        public Task<DataTable> EjecutarConsultaAsync(string consultaSql)
        {
            return _repositorioChat.ConsultarBDAsync(consultaSql);
        }

        public Task<ConsultaNaturalViewModel> EjecutarConsultaNaturalAsync(string pregunta)
        {
            return _repositorioChat.GenerarConsultaSQLAsync(pregunta);
        }
    }
}
