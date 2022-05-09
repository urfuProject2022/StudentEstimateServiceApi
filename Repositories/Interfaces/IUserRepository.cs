using System.Collections.Generic;
using System.Threading.Tasks;
using MongoDB.Bson;
using StudentEstimateServiceApi.Models;

namespace StudentEstimateServiceApi.Repositories.Interfaces
{
    public interface IUserRepository : IBaseRepository<User>
    {
        Task Update(User user);
        Task<IEnumerable<User>> FindRoomUsers(IEnumerable<ObjectId> usersId);
    }
}