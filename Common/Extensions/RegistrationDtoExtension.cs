using System;
using StudentEstimateServiceApi.Models;
using StudentEstimateServiceApi.Models.DTO;

namespace StudentEstimateServiceApi.Common.Extensions
{
    public static class RegistrationDtoExtension
    {
        public static User ToUserModel(this  RegistrationDto registrationDto, Guid id)
        {
            return new User()
            {
                Id = id.ToString(),
                FullName = registrationDto.FullName,
                Role = registrationDto.IsAdmin?Role.Admin:Role.User
            };
        }

        public static UserAuth ToAuthModel(this RegistrationDto registrationDto, Guid id)
        {
            return new UserAuth()
            {
                Id = id,
                Login = registrationDto.Login,
                Password = registrationDto.Password
            };
        }
    }
}
