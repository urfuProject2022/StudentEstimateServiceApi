using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StudentEstimateServiceApi.Common;
using StudentEstimateServiceApi.Common.Extensions;
using StudentEstimateServiceApi.Models;
using StudentEstimateServiceApi.Models.DTO;
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
        private readonly IMapper mapper;

        public UserController(IUserRepository userRepository, IRoomRepository roomRepository, IMapper mapper)
        {
            this.userRepository = userRepository;
            this.roomRepository = roomRepository;
            this.mapper = mapper;
        }

        [HttpGet("me")]
        public async Task<ActionResult<UserDto>> GetSignedInUser()
        {
            var userId = HttpContext.GetUserId();
            if (!userId.HasValue)
                return BadRequest("User is not authorized");

            return await GetUserById(userId.ToString());
        }

        [HttpGet("{userId}")]
        public async Task<ActionResult<UserDto>> GetUserById([FromRoute] string userId)
        {
            var findResult = await userRepository.FindById(userId);

            if (!findResult.IsSuccess)
            {
                return NotFound(findResult.ErrorMessage);
            }

            var userDto = mapper.Map<UserDto>(findResult.Result);

            return Ok(userDto);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetUsersByRoomId([FromQuery] string roomId)
        {
            var roomFindResult = await roomRepository.FindById(roomId);

            if (!roomFindResult.IsSuccess)
            {
                return NotFound(roomFindResult.ErrorMessage);
            }

            var room = roomFindResult.Result;
            var users = await userRepository.FindRoomUsers(room.Users);
            var userDtos = mapper.Map<IEnumerable<UserDto>>(users);

            return Ok(userDtos);
        }

        [HttpPost]
        public async Task<ActionResult<UserDto>> CreateUser([FromBody] UserDto userDto)
        {
            var user = mapper.Map<User>(userDto);

            var createdUser = await userRepository.Create(user);
            var createdUserDto = mapper.Map<UserDto>(createdUser);

            return Ok(createdUserDto);
        }
    }
}