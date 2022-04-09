﻿using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using StudentEstimateServiceApi.Common;
using StudentEstimateServiceApi.Common.Extensions;
using StudentEstimateServiceApi.Infrastructure.Services.InviteService;
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
        private readonly IInviteService inviteService;
        private readonly IMapper mapper;

        public RoomController(IRoomRepository roomRepository, IUserRepository userRepository,
            IInviteService inviteService, IMapper mapper)
        {
            this.roomRepository = roomRepository;
            this.userRepository = userRepository;
            this.inviteService = inviteService;
            this.mapper = mapper;
        }

        [HttpGet("{roomId}")]
        public async Task<ActionResult<RoomDto>> GetRoomById([FromRoute] string roomId)
        {
            var findResult = await roomRepository.FindById(roomId);

            if (!findResult.IsSuccess)
            {
                return NotFound(findResult.ErrorMessage);
            }

            var roomDto = mapper.Map<RoomDto>(findResult.Result);

            return Ok(roomDto);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<RoomDto>>> GetRooms()
        {
            var userId = HttpContext.GetUserId();

            if (!userId.HasValue)
                return BadRequest();

            var rooms = await roomRepository.FindUserRooms(userId.Value);
            var roomsDto = mapper.Map<IEnumerable<RoomDto>>(rooms);

            return Ok(roomsDto);
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

            room.Id = ObjectId.GenerateNewId();
            var findResult = await userRepository.FindById(room.OwnerId);
            var user = findResult.Result;

            if (user.Role != Role.Admin)
                return
                    BadRequest(
                        "Only admins can create rooms!"); // На Forbid() выдаёт Exception - хочет, чтобы отсеивало через куки

            var createdRoom = await roomRepository.Create(room);
            var inviteUrl = inviteService.GenerateInviteUrl(HttpContext.Request.Host.Value, createdRoom.Id);

            if (inviteUrl.IsError)
            {
                return StatusCode(inviteUrl.StatusCode, inviteUrl.ErrorMessage);
            }

            createdRoom.Invite = inviteUrl.Result;
            user.CreatedRooms.Add(createdRoom.Id);
            await userRepository.Update(user);

            var createdRoomDto = mapper.Map<RoomDto>(createdRoom);
            return Ok(createdRoomDto);
        }
    }
}