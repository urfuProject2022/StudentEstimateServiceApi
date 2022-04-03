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
	[Route(Route.Base + "/rooms")]
	[ApiController]
	[Authorize(AuthenticationSchemes = CookieAuthenticationDefaults.AuthenticationScheme)]
	public class RoomController : Controller
	{
		private readonly IRoomRepository roomRepository;
		private readonly IUserRepository userRepository;
		private readonly IMapper mapper;
		
		public RoomController(IRoomRepository roomRepository, IUserRepository userRepository, IMapper mapper)
		{
			this.roomRepository = roomRepository;
			this.userRepository = userRepository;
			this.mapper = mapper;
		}
		
		[HttpPost]
		public async Task<ActionResult<RoomDto>> CreateRoom([FromBody] RoomDto roomDto)
		{
			var room = mapper.Map<Room>(roomDto);

			var userId = HttpContext.GetUserId();
			if (userId.HasValue)
				room.OwnerId = userId.Value;
			else
				return BadRequest();
			
			var findResult = await userRepository.FindById(room.OwnerId);
			var user = findResult.Result;

			//if (user.Role != Role.Admin)
			//	return Forbid();

			var createResult = await roomRepository.Create(room);
			if (!createResult.IsSuccess)
			{
				return BadRequest(createResult.ErrorMessage);
			}

			var createdRoomDto = mapper.Map<RoomDto>(room);
			user.CreatedRooms.Add(room.Id);
			
			var updateResult = await userRepository.Update(user);
			
			if (!updateResult.IsSuccess)
			{
				return BadRequest(updateResult.ErrorMessage);
			}

			return Ok(createdRoomDto);
		}
	}
}