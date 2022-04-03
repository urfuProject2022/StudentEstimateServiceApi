using System.Threading.Tasks;
using MongoDB.Bson;
using MongoDB.Driver;
using StudentEstimateServiceApi.Common;
using StudentEstimateServiceApi.Repositories.Interfaces;
using StudentEstimateServiceApi.Settings;

namespace StudentEstimateServiceApi.Repositories
{
    public class BaseRepository<T> : IBaseRepository<T>
    {
        protected readonly IMongoCollection<T> Collection;

        protected BaseRepository(IMongoDatabaseSettings dbSettings, string collectionName)
        {
            var client = new MongoClient(dbSettings.ConnectionString);
            var database = client.GetDatabase(dbSettings.DatabaseName);

            Collection = database.GetCollection<T>(collectionName);
        }
        
        public Task<OperationResult<T>> FindById(string id)
        {
            if (id == null || !ObjectId.TryParse(id, out var objectId))
                return Task.FromResult(OperationResult<T>.Fail("Wrong id format"));
            return FindById(objectId);
        }
        
        public async Task<OperationResult<T>> FindById(ObjectId id)
        {
            var filter = new BsonDocument("_id", id);
            var user = await Collection.Find(filter).SingleOrDefaultAsync();

            return user == null // Возможно просто стоит возвращать null и на проверке в API кидать NotFound()
                ? OperationResult<T>.Fail($"{typeof(T).Name} with id \"{id}\" is not found")
                : OperationResult<T>.Success(user);
        }

        public async Task<OperationResult<T>> Create(T item)
        {
            await Collection.InsertOneAsync(item);
            return OperationResult<T>.Success(item);
        }

        public Task<OperationResult> Delete(string id)
        {
            if (id == null || !ObjectId.TryParse(id, out var objectId))
                return Task.FromResult(OperationResult.Fail("Wrong id format"));
            return Delete(objectId);
        }
        
        public async Task<OperationResult> Delete(ObjectId id)
        {
            var filter = new BsonDocument("_id", id);
            var deleteResult = await Collection.DeleteOneAsync(filter);
            return deleteResult.IsAcknowledged && deleteResult.DeletedCount == 1
                ? OperationResult.Success()
                : OperationResult.Fail($"An error occurred while deleting {typeof(T).Name} with id {id}");
        }
    }
}