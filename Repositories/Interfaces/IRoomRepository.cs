using System.Threading.Tasks;
using StudentEstimateServiceApi.Common;
using StudentEstimateServiceApi.Models;

namespace StudentEstimateServiceApi.Repositories.Interfaces
{
	public interface IRoomRepository : IBaseRepository<Room>
    {
        Task<OperationResult<Room>> Update(Room room);
    }
}