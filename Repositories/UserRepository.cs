using System.Threading.Tasks;
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
    }
}