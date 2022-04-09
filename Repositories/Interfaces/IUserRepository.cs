﻿using System.Threading.Tasks;
using StudentEstimateServiceApi.Common;
using StudentEstimateServiceApi.Models;

namespace StudentEstimateServiceApi.Repositories.Interfaces
{
    public interface IUserRepository : IBaseRepository<User>
    {
        Task Update(User user);
    }
}