using System.Linq;
using System.Threading.Tasks;
using MongoDB.Bson;
using MongoDB.Driver;
using StudentEstimateServiceApi.Common;
using StudentEstimateServiceApi.Settings;

namespace StudentEstimateServiceApi.Repositories
{
    public class BaseRepository<T>
    {
        protected readonly IMongoCollection<T> collection;

        public BaseRepository(IMongoDatabaseSettings dbSettings, string collectionName)
        {
            var client = new MongoClient(dbSettings.ConnectionString);
            var database = client.GetDatabase(dbSettings.DatabaseName);

            collection = database.GetCollection<T>(collectionName);
        }
        
        public async Task<OperationResult<T>> FindById(string id)
        {
            var filter = new BsonDocument() { { "id", id } };
            var findResult = await collection.Find(filter).ToListAsync();
            var user = findResult.FirstOrDefault();

            return user == null
                ? OperationResult<T>.Fail($"{nameof(T)} with {id} is not found")
                : OperationResult<T>.Success(user);
        }

        public async Task<OperationResult<T>> Create(T create)
        {
            await collection.InsertOneAsync(create);
            return OperationResult<T>.Success(create);
        }

        public async Task<OperationResult> Delete(string id)
        {
            var filter = new BsonDocument() { { "id", id } };
            var deleteResult = await collection.DeleteOneAsync(filter);
            return deleteResult.IsAcknowledged && deleteResult.DeletedCount == 1
                ? OperationResult.Success()
                : OperationResult.Fail($"An error occurred while deleting user with id {id}");
        }
    }
}