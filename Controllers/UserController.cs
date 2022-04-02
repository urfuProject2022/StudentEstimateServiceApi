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
    [Route(Route.Base + "users")]
    [ApiController]
    [Authorize(AuthenticationSchemes = CookieAuthenticationDefaults.AuthenticationScheme)]
    public class UserController : Controller
    {
        private readonly IUserRepository userRepository;
        private readonly IMapper mapper;

        public UserController(IUserRepository userRepository, IMapper mapper)
        {
            this.userRepository = userRepository;
            this.mapper = mapper;
        }

        [HttpGet("{userId}")]
        public async Task<ActionResult<UserDto>> GetUserById([FromRoute] string userId)
        {
            var findResult = await userRepository.FindById(userId);
            
            //GetUserRooms - Идём в RoomRepository за комнатами по Id

            if (!findResult.IsSuccess)
            {
                return BadRequest(findResult.ErrorMessage);
            }

            var userDto = mapper.Map<UserDto>(findResult.Result);

            return Ok(userDto);
        }

        [HttpPost]
        public async Task<ActionResult<UserDto>> CreateUser([FromBody] UserDto userDto)
        {
            var user = mapper.Map<User>(userDto);

            var createResult = await userRepository.Create(user);
            if (!createResult.IsSuccess)
            {
                return BadRequest(createResult.ErrorMessage);
            }
            
            var createdUserDto = mapper.Map<UserDto>(createResult.Result);

            return Ok(createdUserDto);
        }
    }
}