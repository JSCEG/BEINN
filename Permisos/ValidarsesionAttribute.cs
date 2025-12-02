using Microsoft.AspNetCore.Mvc.Filters;
using BEINN.Controllers;

namespace BEINN.Permisos
{

    public class ValidarsesionAttribute : ActionFilterAttribute

    {
        //sobre escribir un metodo predeterminado

        public override void OnActionExecuting(ActionExecutingContext context)
        {



            base.OnActionExecuting(context);
        }


    }
}
