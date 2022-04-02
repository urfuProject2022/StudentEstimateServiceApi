using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using StudentEstimateServiceApi.Common;
using StudentEstimateServiceApi.Models;
using StudentEstimateServiceApi.Models.DTO;
using StudentEstimateServiceApi.Repositories.Interfaces;

namespace StudentEstimateServiceApi.Controllers
{
    [Route(Route.Base + "/auth")]
    [Authorize(AuthenticationSchemes = CookieAuthenticationDefaults.AuthenticationScheme)]
    public class AuthController : Controller
    {
        private readonly IAuthRepository authRepository;
        private readonly IUserRepository userRepository;
        private readonly IMapper mapper;

        public AuthController(IAuthRepository authRepository, IUserRepository userRepository, IMapper mapper)
        {
            this.authRepository = authRepository;
            this.userRepository = userRepository;
            this.mapper = mapper;
        }

        [HttpPost("login")]
        public async Task<ActionResult> Login([FromHeader] string login, [FromHeader] string password)
        {
            var userAuth = await authRepository.FindFirst(x => x.Login == login && x.Password == password);

            if (userAuth == null) 
                return BadRequest("Неверный логин или пароль");

            await SignIn(userAuth.UserId.ToString());

            return Ok();
        }

        [HttpPost("register")]
        public async Task<ActionResult> Register([FromBody] RegistrationDto registrationDto)
        {
            var isUserExists = await authRepository.Any(x => x.Login == registrationDto.Login);
            if (isUserExists) 
                return BadRequest("Пользователь с таким логином уже есть");

            var id = ObjectId.GenerateNewId();
            var user = new User { Id = id };
            var userAuth = new UserAuth { UserId = id };
            mapper.Map(registrationDto, user);
            mapper.Map(registrationDto, userAuth);
            await authRepository.Create(userAuth);
            await userRepository.Create(user);


            await SignIn(id.ToString());

            return Ok();
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