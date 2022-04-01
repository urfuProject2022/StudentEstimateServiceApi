using System;
using MongoDB.Bson;
using StudentEstimateServiceApi.Models;
using StudentEstimateServiceApi.Models.DTO;

namespace StudentEstimateServiceApi.Common.Extensions
{
    public static class RegistrationDtoExtension
    {
        public static User ToUserModel(this RegistrationDto registrationDto, BsonObjectId id)
        {
            return new User
            {
                Id = id,
                FullName = registrationDto.FullName,
                Role = registrationDto.IsAdmin ? Role.Admin : Role.User
            };
        }

        public static UserAuth ToAuthModel(this RegistrationDto registrationDto, BsonObjectId id)
        {
            return new UserAuth
            {
                UserId = id,
                Login = registrationDto.Login,
                Password = registrationDto.Password
            };
        }
    }
}