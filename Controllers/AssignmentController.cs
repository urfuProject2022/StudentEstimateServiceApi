using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StudentEstimateServiceApi.Common;
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
        private readonly IMapper mapper;

        public AssignmentController(IAssignmentRepository assignmentRepository, IRoomRepository roomRepository,
            IMapper mapper)
        {
            this.assignmentRepository = assignmentRepository;
            this.roomRepository = roomRepository;
            this.mapper = mapper;
        }

        [HttpGet("{assignmentId}")]
        public async Task<ActionResult<AssignmentDto>> GetAssignmentById([FromRoute] string assignmentId)
        {
            var assignmentFindResult = await assignmentRepository.FindById(assignmentId);

            if (!assignmentFindResult.IsSuccess)
            {
                return NotFound(assignmentFindResult.ErrorMessage);
            }

            var assignmentDto = mapper.Map<AssignmentDto>(assignmentFindResult.Result);

            return Ok(assignmentDto);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<AssignmentDto>>> GetAssignments([FromQuery] string roomId)
        {
            var roomFindResult = await roomRepository.FindById(roomId);

            if (!roomFindResult.IsSuccess)
            {
                return NotFound(roomFindResult.ErrorMessage);
            }

            var room = roomFindResult.Result;
            var assignments = await assignmentRepository.FindRoomAssignments(room.Assignments);
            var assignmentDtos = mapper.Map<IEnumerable<AssignmentDto>>(assignments);

            return Ok(assignmentDtos);
        }

        [HttpPost]
        public async Task<ActionResult<AssignmentDto>> CreateAssignment([FromBody] AssignmentDto assignmentDto,
            [FromQuery] string roomId)
        {
            var roomFindResult = await roomRepository.FindById(roomId);

            if (!roomFindResult.IsSuccess)
            {
                return NotFound(roomFindResult.ErrorMessage);
            }

            var room = roomFindResult.Result;
            var assignment = mapper.Map<Assignment>(assignmentDto);

            var createdAssignment = await assignmentRepository.Create(assignment);

            room.Assignments.Add(createdAssignment.Id);
            await roomRepository.Update(room);

            return Ok(createdAssignment);
        }
    }
}