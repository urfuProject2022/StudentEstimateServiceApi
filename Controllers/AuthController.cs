using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using StudentEstimateServiceApi.Common;
using StudentEstimateServiceApi.Common.Extensions;
using StudentEstimateServiceApi.Models.DTO;
using StudentEstimateServiceApi.Repositories;

namespace StudentEstimateServiceApi.Controllers
{
    [Route(Route.Base + "/auth")]
    public class AuthController : Controller
    {
        private readonly AuthRepository authRepository;
        private readonly IUserRepository userRepository;

        public AuthController(AuthRepository authRepository, IUserRepository userRepository)
        {
            this.authRepository = authRepository;
            this.userRepository = userRepository;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromHeader] string login, [FromHeader] string password)
        {
            var userAuth =await authRepository.FindFirst(x=>x.Login == login && x.Password == password);

            if (userAuth == null) 
                return BadRequest(OperationResult.Fail("Неверный логин или пароль"));

            await SignIn(userAuth.UserId.ToString());

            return Ok(OperationResult.Success());
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegistrationDto registrationDto)
        {
            var isUserExists = await authRepository.Any(x => x.Login == registrationDto.Login);
            if (isUserExists) 
                return BadRequest(OperationResult.Fail("Пользователь с таким логином уже есть"));

            var id = new BsonObjectId(ObjectId.GenerateNewId());
            await authRepository.Create(registrationDto.ToAuthModel(id));
            await userRepository.Create(registrationDto.ToUserModel(id));


            await SignIn(id.ToString());

            return Ok(OperationResult.Success());
        }

        private Task SignIn(string userId)
        {
            var claims = new List<Claim>
            {
                new(ClaimsIdentity.DefaultNameClaimType, userId)
            };
            var id = new ClaimsIdentity(claims, "ApplicationCookie", ClaimsIdentity.DefaultNameClaimType, ClaimsIdentity.DefaultRoleClaimType);
            return HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(id));
        }
    }
}