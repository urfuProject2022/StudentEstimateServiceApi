using System.Threading.Tasks;
using MongoDB.Driver;
using StudentEstimateServiceApi.Common;
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

        public async Task<OperationResult<User>> Update(User user)
        {
            await Collection.ReplaceOneAsync(u => u.Id == user.Id, user);
            return OperationResult<User>.Success(user);
        }
    }   
}