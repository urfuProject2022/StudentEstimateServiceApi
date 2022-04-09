using System.Collections.Generic;
using System.Threading.Tasks;
using MongoDB.Bson;
using StudentEstimateServiceApi.Models;

namespace StudentEstimateServiceApi.Repositories.Interfaces
{
    public interface IRoomRepository : IBaseRepository<Room>
    {
        public Task<IEnumerable<Room>> FindUserRooms(ObjectId userId);
        public Task Update(Room room);
    }
}