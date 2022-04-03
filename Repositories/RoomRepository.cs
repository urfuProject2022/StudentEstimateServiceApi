using System.Threading.Tasks;
using MongoDB.Driver;
using StudentEstimateServiceApi.Common;
using StudentEstimateServiceApi.Models;
using StudentEstimateServiceApi.Repositories.Interfaces;
using StudentEstimateServiceApi.Settings;

namespace StudentEstimateServiceApi.Repositories
{
	public class RoomRepository : BaseRepository<Room>, IRoomRepository
	{
		public RoomRepository(IMongoDatabaseSettings dbSettings) : base(dbSettings, dbSettings.RoomCollectionName)
		{
		}

        public async Task<OperationResult<Room>> Update(Room room)
        {
            await Collection.ReplaceOneAsync(r => r.Id == room.Id, room);
            return OperationResult<Room>.Success(room);
        }
	}
}