using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StudentEstimateServiceApi.Common;
using StudentEstimateServiceApi.Common.Extensions;
using StudentEstimateServiceApi.Infrastructure.Services.WorkService;
using StudentEstimateServiceApi.Models;
using StudentEstimateServiceApi.Models.DTO;

namespace StudentEstimateServiceApi.Controllers
{
    [Route(Route.Base + "/work")]
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

            if (submitOperationResult.IsError)
                return StatusCode(submitOperationResult.StatusCode, submitOperationResult.ErrorMessage);

            return Ok();
        }

        [HttpGet("to-grade")]
        public async Task<ActionResult> GetWorkToGrade([FromBody] GetWorksToGradeDto dto)
        {
            var userId = HttpContext.GetUserId();

            if (!userId.HasValue)
                return BadRequest();

            var worksToGradeDto = mapper.Map<GetWorksToGrade>(dto);

            var worksToGradeOperationResult = await workService.GetWorksToGrade(worksToGradeDto, userId.Value);

            return worksToGradeOperationResult.ToApiResponse();
        }
    }
}