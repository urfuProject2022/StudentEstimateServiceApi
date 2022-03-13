using System;
using System.Threading.Tasks;
using StudentEstimateServiceApi.Common;
using StudentEstimateServiceApi.Models;

namespace StudentEstimateServiceApi.Repositories
{
    public interface IUserRepository
    {
        Task<OperationResult<User>> FindById(string id);
        Task<OperationResult<User>> Create(User user);
        Task<OperationResult> Delete(string id);
    }
}