using System.Threading.Tasks;
using AutoMapper;
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
        private readonly IMapper mapper;

        public WorkController(IWorkService workService, IMapper mapper)
        {
            this.workService = workService;
            this.mapper = mapper;
        }

        [HttpPost("submit")]
        public async Task<ActionResult> Submit(SubmitWorkDto submitWorkDto)
        {
            var userId = HttpContext.GetUserId();

            if (!userId.HasValue)
                return BadRequest();

            var submitWork = mapper.Map<SubmitWork>(submitWorkDto);
            var submitOperationResult = await workService.Submit(submitWork, userId.Value);
            
            return submitOperationResult.ToApiResponse();
        }

        [HttpGet("to-grade")]
        public async Task<ActionResult<BatchWorksToGradeDto>> GetWorkToGrade([FromQuery] string assignment,
            [FromQuery] string room)
        {
            var userId = HttpContext.GetUserId();

            if (!userId.HasValue ||
                !ObjectId.TryParse(assignment, out var assignmentId) ||
                !ObjectId.TryParse(room, out var roomId))
                return BadRequest();

            var getWorksToGrade = new GetWorksToGrade() { Assignment = assignmentId, Room = roomId };

            var worksToGradeOperationResult = await workService.GetWorksToGrade(getWorksToGrade, userId.Value);

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