using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StudentEstimateServiceApi.Common;
using StudentEstimateServiceApi.Common.Extensions;
using StudentEstimateServiceApi.Infrastructure.GradeService;
using StudentEstimateServiceApi.Models.DTO;

namespace StudentEstimateServiceApi.Controllers
{
    [Route(Route.Base + "/grade")]
    [Authorize(AuthenticationSchemes = CookieAuthenticationDefaults.AuthenticationScheme)]
    public class GradeController : Controller
    {
        private readonly IGradeService gradeService;

        public GradeController(IGradeService gradeService)
        {
            this.gradeService = gradeService;
        }

        [HttpPost("set")]
        public async Task<ActionResult> SetGrade(SetGradeDto dto)
        {
            var user = HttpContext.GetUserId();

            if (!user.HasValue)
                return BadRequest();

            var setGradeOperationResult = await gradeService.SetGrade(dto, user.Value);

            return setGradeOperationResult.ToApiResponse();
        }
    }
}