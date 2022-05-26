using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using StudentEstimateServiceApi.Common;
using StudentEstimateServiceApi.Common.Extensions;
using StudentEstimateServiceApi.Infrastructure.Services.WorkService;
using StudentEstimateServiceApi.Models;
using StudentEstimateServiceApi.Models.DTO;

namespace StudentEstimateServiceApi.Controllers
{
    [Route(Route.Base + "/works")]
    [Authorize(AuthenticationSchemes = CookieAuthenticationDefaults.AuthenticationScheme)]
    public class WorkController : Controller
    {
        private readonly IWorkService workService;

        public WorkController(IWorkService workService)
        {
            this.workService = workService;
        }

        [HttpPost("submit")]
        public async Task<ActionResult> Submit([FromBody] SubmitWork submitWork)
        {
            var userId = HttpContext.GetUserId();

            if (!userId.HasValue)
                return BadRequest();

            var submitOperationResult = await workService.Submit(submitWork, userId.Value);
            return submitOperationResult.ToApiResponse();
        }

        [HttpGet("to-grade")]
        public async Task<ActionResult> GetWorkToGrade([FromBody] GetWorksToGrade worksToGradeDto)
        {
            var userId = HttpContext.GetUserId();

            if (!userId.HasValue)
                return BadRequest();

            var worksToGradeOperationResult = await workService.GetWorksToGrade(worksToGradeDto, userId.Value);

            return worksToGradeOperationResult.ToApiResponse();
        }

        [HttpGet("userWork")]
        public async Task<ActionResult> GetUserWork([FromQuery] string assignment)
        {
            var userId = HttpContext.GetUserId();

            if (!userId.HasValue)
                return BadRequest();

            if (!ObjectId.TryParse(assignment, out var assignmentId))
                return BadRequest();

            var userWork = await workService.GetUserWork(assignmentId, userId.Value);
            return userWork.ToApiResponse();
        }
    }
}