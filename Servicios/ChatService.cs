namespace BEINN.Servicios
{
    public interface IChatService
    {
        Task<string> PreguntarAsync(string prompt);
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
    }
}
