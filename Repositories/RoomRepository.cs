using System.Collections.Generic;
using System.Threading.Tasks;
using MongoDB.Bson;
using MongoDB.Driver;
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

        public async Task<IEnumerable<Room>> FindUserRooms(ObjectId userId)
        {
            var rooms = await Collection.Find(room => room.OwnerId == userId)
                .ToListAsync(); // TODO: add Mongo index to "ownerId" field
            return rooms;
        }

        public async Task Update(Room room)
        {
            await Collection.ReplaceOneAsync(r => r.Id == room.Id, room);
        }
    }
}