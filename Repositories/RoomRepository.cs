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
	}
}