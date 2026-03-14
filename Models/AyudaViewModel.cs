namespace BEINN.Models
{
    public class AyudaViewModel
    {
        public string PageTitle { get; set; } = "Ayuda";
        public string IntroTitle { get; set; } = "Centro de Ayuda BEINN";
        public string IntroDescription { get; set; } = "Guías, preguntas frecuentes y canales de soporte para usuarios y clientes.";
        public string PresentationVideoPath { get; set; } = "/video/snie_presentacion.mp4";
        public string ManualElectricidadUrl { get; set; } = "https://heyzine.com/flip-book/snie_manual_electricidad.html";
        public string ManualHidrocarburosUrl { get; set; } = "https://heyzine.com/flip-book/snie_manual_hidrocarburos.html";
        public string SupportDirectoryUrl { get; set; } = "https://www.gob.mx/sener/acciones-y-programas/directorio";
        public string SupportAddress { get; set; } = "Av. Insurgentes Sur 890, Col. del Valle, CDMX";
        public string SupportPhone { get; set; } = "(+52) 55 5000 6000";
        public string SupportEmail { get; set; } = "soporte@beinn.mx";
    }
}
