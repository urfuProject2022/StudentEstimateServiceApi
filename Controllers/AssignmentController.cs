using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using StudentEstimateServiceApi.Common;
using StudentEstimateServiceApi.Common.Extensions;
using StudentEstimateServiceApi.Models;
using StudentEstimateServiceApi.Models.DTO;
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
            var assignmentFindResult = await assignmentRepository.FindById(assignmentId);
            return assignmentFindResult.ToApiResponse();
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Assignment>>> GetAssignments([FromQuery] string roomId)
        {
            var roomFindResult = await roomRepository.FindById(roomId);

            if (!roomFindResult.IsSuccess)
            {
                return NotFound(roomFindResult.ErrorMessage);
            }

            var room = roomFindResult.Result;
            var assignments = await assignmentRepository.FindRoomAssignments(room.Assignments);
           
            return Ok(assignments);
        }

        [HttpPost]
        public async Task<ActionResult<Assignment>> CreateAssignment([FromBody] Assignment assignment,
            [FromQuery] string roomId)
        {
            assignment.MaxGradeCountForWork ??= Constants.MaxGradeCountForWork;
            assignment.MinGradeCountForWork ??= Constants.MinGradeCountForWork;
            assignment.Id = ObjectId.GenerateNewId();

            var roomFindResult = await roomRepository.FindById(roomId);

            if (!roomFindResult.IsSuccess)
            {
                return NotFound(roomFindResult.ErrorMessage);
            }

            var room = roomFindResult.Result;

            var createdAssignment = await assignmentRepository.Create(assignment);

            room.Assignments.Add(createdAssignment.Id);
            await roomRepository.Update(room);

            return Ok(createdAssignment);
        }
    }
}