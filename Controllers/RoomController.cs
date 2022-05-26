using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using StudentEstimateServiceApi.Common;
using StudentEstimateServiceApi.Common.Extensions;
using StudentEstimateServiceApi.Infrastructure.Services.InviteService;
using StudentEstimateServiceApi.Models;
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
        private readonly IInviteService inviteService;

        public RoomController(IRoomRepository roomRepository, IUserRepository userRepository,
            IInviteService inviteService)
        {
            this.roomRepository = roomRepository;
            this.userRepository = userRepository;
            this.inviteService = inviteService;
        }

        [HttpGet("{roomId}")]
        public async Task<ActionResult<Room>> GetRoomById([FromRoute] string roomId)
        {
            var userId = HttpContext.GetUserId();

            if (!userId.HasValue)
                return BadRequest();

            var roomResult = await roomRepository.FindById(roomId);
            var room = roomResult.Result;

            if (!room.Users.Contains(userId.Value) && room.OwnerId != userId.Value)
                return BadRequest("No access to room");


            return roomResult.ToApiResponse();
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Room>>> GetRooms()
        {
            var userId = HttpContext.GetUserId();

            if (!userId.HasValue)
                return BadRequest();

            var userFindResult = await userRepository.FindById(userId.Value);

            if (!userFindResult.IsSuccess) return NotFound(userFindResult.ErrorMessage);

            var rooms = await roomRepository.FindUserRooms(userFindResult.Result);
            return Ok(rooms);
        }

        [HttpPost]
        public async Task<ActionResult<Room>> CreateRoom([FromBody] Room room)
        {
            var userId = HttpContext.GetUserId();
            if (userId.HasValue)
                room.OwnerId = userId.Value;
            else
                return BadRequest();

            var findResult = await userRepository.FindById(room.OwnerId);
            var user = findResult.Result;

            if (user.Role != Role.Admin)
                return BadRequest("Only admins can create rooms!");

            room.Id = ObjectId.GenerateNewId();
            room.OwnerName = user.FullName;

            var inviteUrl = inviteService.GenerateInviteUrl(HttpContext.Request.Host.Value, room.Id);

            if (inviteUrl.IsError)
                return StatusCode(inviteUrl.StatusCode, inviteUrl.ErrorMessage);

            room.InviteLink = inviteUrl.Result;

            var createdRoom = await roomRepository.Create(room);

            user.CreatedRooms.Add(room.Id);
            await userRepository.Update(user);

            return Ok(createdRoom);
        }
    }
}