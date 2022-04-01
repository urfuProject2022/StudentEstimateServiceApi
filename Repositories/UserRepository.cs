using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using MongoDB.Driver;
using StudentEstimateServiceApi.Common;
using StudentEstimateServiceApi.Models;
using StudentEstimateServiceApi.Settings;

namespace StudentEstimateServiceApi.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly IMongoCollection<User> collection;

        public UserRepository(IMongoDatabaseSettings dbSettings)
        {
            var client = new MongoClient(dbSettings.ConnectionString);
            var database = client.GetDatabase(dbSettings.DatabaseName);

            collection = database.GetCollection<User>(dbSettings.UserCollectionName);
        }

        public async Task<OperationResult<User>> FindById(string id)
        {
            var findResult = await collection.Find(u => u.Id == id).ToListAsync();
            var user = findResult.FirstOrDefault();

            return user == null
                ? OperationResult<User>.Fail($"{nameof(User)} with {id} is not found")
                : OperationResult<User>.Success(user);
        }

        public async Task<OperationResult<User>> Create(User user)
        {
            await collection.InsertOneAsync(user);
            return OperationResult<User>.Success(user);
        }

        public async Task<OperationResult> Delete(string id)
        {
            var deleteResult = await collection.DeleteOneAsync(u => u.Id == id);
            return deleteResult.IsAcknowledged && deleteResult.DeletedCount == 1
                ? OperationResult.Success()
                : OperationResult.Fail($"An error occurred while deleting user with id {id}");
        }
    }
}