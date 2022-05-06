using System.Collections.Generic;
using System.Threading.Tasks;
using StudentEstimateServiceApi.Models;

namespace StudentEstimateServiceApi.Repositories.Interfaces
{
    public interface IRoomRepository : IBaseRepository<Room>
    {
        public Task<IEnumerable<Room>> FindUserRooms(User user);
        public Task Update(Room room);
    }
}