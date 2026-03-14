namespace BEINN.Models
{
    public class MiPerfilViewModel
    {
        public int IdUsuario { get; set; }
        public string Nombre { get; set; }
        public string Correo { get; set; }
        public string RFC { get; set; }
        public string Cargo { get; set; }
        public string UnidadDeAdscripcion { get; set; }
        public string ClaveEmpleado { get; set; }
        public bool SesionActiva { get; set; }
        public bool Vigente { get; set; }
        public string RolNombre { get; set; }
        public string MercadoNombre { get; set; }
    }
}
