using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using StudentEstimateServiceApi.Models;
using StudentEstimateServiceApi.Models.DTO;
using StudentEstimateServiceApi.Repositories;

namespace StudentEstimateServiceApi.Controllers
{
    [Route("users")]
    [ApiController]
    public class UserController : Controller
    {
        private readonly IUserRepository userRepository;

        public UserController(IUserRepository userRepository)
        {
            this.userRepository = userRepository;
        }

        [HttpGet("{userId}")]
        public async Task<ActionResult<UserDTO>> GetUserById([FromRoute] string userId)
        {
            var result = await userRepository.FindById(userId);
            
            //GetUserRooms - Идём в RoomRepository за комнатами по Id

            if (!result.IsSuccess)
            {
                return BadRequest(result.ErrorMessage);
            }

            return Ok(result.Result);
        }

        [HttpPost]
        public async Task<ActionResult<UserDTO>> CreateUser([FromBody] UserDTO userDTO)
        {
            var user = new User()
            {
                Id = userDTO.Id,
                FullName = userDTO.FullName,
                Role = userDTO.Role
            }; // Change to Mapper....

            var createResult = await userRepository.Create(user);
            if (!createResult.IsSuccess)
            {
                return BadRequest(createResult.ErrorMessage);
            }

            return Ok(createResult.Result);
        }
    }
}