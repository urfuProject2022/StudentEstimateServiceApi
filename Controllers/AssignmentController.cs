using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using StudentEstimateServiceApi.Common;
using StudentEstimateServiceApi.Common.Extensions;
using StudentEstimateServiceApi.Models;
using StudentEstimateServiceApi.Repositories.Interfaces;

namespace StudentEstimateServiceApi.Controllers
{
    [Route(Route.Base + "/assignments")]
    [ApiController]
    [Authorize(AuthenticationSchemes = CookieAuthenticationDefaults.AuthenticationScheme)]
    public class AssignmentController : Controller
    {
        private readonly IAssignmentRepository assignmentRepository;
        private readonly IRoomRepository roomRepository;

        public AssignmentController(IAssignmentRepository assignmentRepository, IRoomRepository roomRepository)
        {
            this.assignmentRepository = assignmentRepository;
            this.roomRepository = roomRepository;
        }

        [HttpGet("{assignmentId}")]
        public async Task<ActionResult<Assignment>> GetAssignmentById([FromRoute] string assignmentId)
        {
            var userId = HttpContext.GetUserId();

            if (!userId.HasValue)
                return BadRequest();

            var assignmentFindResult = await assignmentRepository.FindById(assignmentId);

            if (assignmentFindResult.IsError)
                return assignmentFindResult.ToApiResponse();

            var room = await roomRepository.FindFirst(x => x.Assignments.Contains(assignmentFindResult.Result.Id));

            if (room == null)
                return NotFound("Room not found");

            if (!room.Users.Contains(userId.Value) && room.OwnerId != userId.Value)
                return BadRequest("No access to assignment");


            return assignmentFindResult.ToApiResponse();
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Assignment>>> GetAssignments([FromQuery] string roomId)
        {
            var userId = HttpContext.GetUserId();

            if (!userId.HasValue)
                return BadRequest();

            var roomFindResult = await roomRepository.FindById(roomId);

            if (!roomFindResult.IsSuccess)
                return NotFound(roomFindResult.ErrorMessage);

            var room = roomFindResult.Result;

            if (!room.Users.Contains(userId.Value) && room.OwnerId != userId.Value)
                return BadRequest("No access to assignment");

            var assignments = await assignmentRepository.FindRoomAssignments(room.Assignments);

            return Ok(assignments);
        }

        [HttpPost]
        public async Task<ActionResult<Assignment>> CreateAssignment([FromBody] Assignment assignment,
            [FromQuery] string roomId)
        {
            var userId = HttpContext.GetUserId();

            if (!userId.HasValue)
                return BadRequest();

            assignment.MaxGradeCountForWork ??= Constants.MaxGradeCountForWork;
            assignment.MinGradeCountForWork ??= Constants.MinGradeCountForWork;
            assignment.Id = ObjectId.GenerateNewId();

            var roomFindResult = await roomRepository.FindById(roomId);

            if (!roomFindResult.IsSuccess)
                return NotFound(roomFindResult.ErrorMessage);

            var room = roomFindResult.Result;

            if (room.OwnerId != userId.Value)
                return BadRequest("Only admin can create assignment");

            var createdAssignment = await assignmentRepository.Create(assignment);

            room.Assignments.Add(createdAssignment.Id);
            await roomRepository.Update(room);

            return Ok(createdAssignment);
        }
    }
}