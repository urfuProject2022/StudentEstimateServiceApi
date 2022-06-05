using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using StudentEstimateServiceApi.Common;
using StudentEstimateServiceApi.Common.Extensions;
using StudentEstimateServiceApi.Infrastructure.Services.StatisticsService;

namespace StudentEstimateServiceApi.Controllers
{
    [Route(Route.Base + "/statistics")]
    [ApiController]
    [Authorize(AuthenticationSchemes = CookieAuthenticationDefaults.AuthenticationScheme)]
    public class StatisticsController : Controller
    {
        private readonly IStatisticsService statisticsService;

        public StatisticsController(IStatisticsService statisticsService)
        {
            this.statisticsService = statisticsService;
        }

        [HttpGet("by-room")]
        public async Task<IActionResult> GetStatisticsByRoom([FromQuery] string roomId)
        {
            var userId = HttpContext.GetUserId();

            if (!userId.HasValue || !ObjectId.TryParse(roomId, out var roomObjectId))
                return BadRequest();

            var statResult = await statisticsService.GetStatisticByRoom(roomObjectId, userId.Value);
            return statResult.ToApiResponse();
        }

        [HttpGet("by-assignment")]
        public async Task<ActionResult> GetStatisticsByAssignment([FromQuery] string assignmentId)
        {
            var userId = HttpContext.GetUserId();

            if (!userId.HasValue || !ObjectId.TryParse(assignmentId, out var assignmentObjectId))
                return BadRequest();

            var statResult = await statisticsService.GetStatisticByAssignment(assignmentObjectId, userId.Value);
            return statResult.ToApiResponse();
        }
    }
}