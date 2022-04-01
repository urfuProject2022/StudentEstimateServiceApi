using System.Threading.Tasks;
using MongoDB.Bson;
using MongoDB.Driver;
using StudentEstimateServiceApi.Common;
using StudentEstimateServiceApi.Settings;

namespace StudentEstimateServiceApi.Repositories
{
    public class BaseRepository<T> where T : class
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
            if (!ObjectId.TryParse(id, out var objectId))
                return OperationResult<T>.Fail("Wrong id format");
            
            var filter = new BsonDocument("_id", objectId);
            var user = await collection.Find(filter).SingleOrDefaultAsync();

            return user == null
                ? OperationResult<T>.Fail($"{typeof(T).Name} with id \"{id}\" is not found")
                : OperationResult<T>.Success(user);
        }

        public async Task<OperationResult<T>> Create(T item)
        {
            await collection.InsertOneAsync(item);
            return OperationResult<T>.Success(item);
        }

        public async Task<OperationResult> Delete(string id)
        {
            if (!ObjectId.TryParse(id, out var objectId))
                return OperationResult<T>.Fail("Wrong id format");
            
            var filter = new BsonDocument("_id", objectId);
            var deleteResult = await collection.DeleteOneAsync(filter);
            return deleteResult.IsAcknowledged && deleteResult.DeletedCount == 1
                ? OperationResult.Success()
                : OperationResult.Fail($"An error occurred while deleting {typeof(T).Name} with id {id}");
        }
    }
}