﻿using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StudentEstimateServiceApi.Common;
using StudentEstimateServiceApi.Common.Extensions;
using StudentEstimateServiceApi.Infrastructure.Services.InviteService;

namespace StudentEstimateServiceApi.Controllers
{
    [Authorize(AuthenticationSchemes = CookieAuthenticationDefaults.AuthenticationScheme)]
    [Route(Route.Base + "/invites")]
    public class InviteController : Controller
    {
        private readonly IInviteService inviteService;

        public InviteController(IInviteService inviteService)
        {
            this.inviteService = inviteService;
        }

        [HttpGet("accept")]
        public async Task<ActionResult> Accept([FromQuery] string roomId)
        {
            var userId = HttpContext.GetUserId();

            if (userId == null)
                return Unauthorized();

            var acceptResult = await inviteService.Accept(roomId, userId);
            if (acceptResult.IsError)
                return StatusCode((int)HttpStatusCode.InternalServerError, acceptResult.ErrorMessage);

            return Ok();
        }
    }
}