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
    [Route(Route.Base + "/users")]
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

            if (!findResult.IsSuccess)
            {
                return NotFound(findResult.ErrorMessage);
            }

            var userDto = mapper.Map<UserDto>(findResult.Result);

            return Ok(userDto);
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