using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StudentEstimateServiceApi.Common;
using StudentEstimateServiceApi.Common.Extensions;
using StudentEstimateServiceApi.Models;
using StudentEstimateServiceApi.Repositories.Interfaces;

namespace StudentEstimateServiceApi.Controllers
{
    [Route(Route.Base + "/users")]
    [ApiController]
    [Authorize(AuthenticationSchemes = CookieAuthenticationDefaults.AuthenticationScheme)]
    public class UserController : Controller
    {
        private readonly IUserRepository userRepository;
        private readonly IRoomRepository roomRepository;

        public UserController(IUserRepository userRepository, IRoomRepository roomRepository)
        {
            this.userRepository = userRepository;
            this.roomRepository = roomRepository;
        }

        [HttpGet("me")]
        public async Task<ActionResult<User>> GetSignedInUser()
        {
            var userId = HttpContext.GetUserId();
            if (!userId.HasValue)
                return BadRequest("User is not authorized");

            return await GetUserById(userId.ToString());
        }

        [HttpGet("{userId}")]
        public async Task<ActionResult<User>> GetUserById([FromRoute] string userId)
        {
            var currentUserId = HttpContext.GetUserId();

            if (!currentUserId.HasValue)
                return BadRequest();

            var currentUserResult = await userRepository.FindById(currentUserId.Value);
            if (currentUserResult.IsError)
                return BadRequest();

            var currentUser = currentUserResult.Result;

            if (currentUser.Role != Role.Admin && currentUserId.ToString() != userId)
                return BadRequest();

            var findResult = await userRepository.FindById(userId);
            return findResult.ToApiResponse();
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsersByRoomId([FromQuery] string roomId)
        {
            var roomFindResult = await roomRepository.FindById(roomId);

            if (!roomFindResult.IsSuccess) 
                return NotFound(roomFindResult.ErrorMessage);

            var room = roomFindResult.Result;
            var users = await userRepository.FindRoomUsers(room.Users);

            return Ok(users);
        }
    }
}