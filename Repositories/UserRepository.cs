using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Bson;
using MongoDB.Driver;
using StudentEstimateServiceApi.Models;
using StudentEstimateServiceApi.Repositories.Interfaces;
using StudentEstimateServiceApi.Settings;

namespace StudentEstimateServiceApi.Repositories
{
    public class UserRepository : BaseRepository<User>, IUserRepository
    {
        public UserRepository(IMongoDatabaseSettings dbSettings) : base(dbSettings, dbSettings.UserCollectionName)
        {
        }

        public async Task Update(User user)
        {
            await Collection.ReplaceOneAsync(u => u.Id == user.Id, user);
        }
        
        public async Task<IEnumerable<User>> FindRoomUsers(IEnumerable<ObjectId> usersId)
        {
            return await Collection.Find(u => usersId.Contains(u.Id)).ToListAsync();
        }

        public async Task<List<User>> FindMany(IEnumerable<ObjectId> batch)
        {
            var filter = Builders<User>.Filter.In(x => x.Id, batch);
            var findResult = await Collection.FindAsync(filter);
            return findResult.ToList();
        }
    }
}