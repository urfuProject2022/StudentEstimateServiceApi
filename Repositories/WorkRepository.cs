using System.Threading.Tasks;
using MongoDB.Bson;
using MongoDB.Driver;
using StudentEstimateServiceApi.Models;
using StudentEstimateServiceApi.Repositories.Interfaces;
using StudentEstimateServiceApi.Settings;

namespace StudentEstimateServiceApi.Repositories
{
    public class WorkRepository : BaseRepository<Work>, IWorkRepository
    {
        public WorkRepository(IMongoDatabaseSettings dbSettings) : base(dbSettings, dbSettings.WorkCollectionName)
        {
        }

        public Task<Work> FindStudentWork(ObjectId studentId, ObjectId assignmentId)
        {
            var filter = Builders<Work>.Filter.Where(x => x.UserId == studentId && x.Assignment == assignmentId);
            return Collection.Find(filter).SingleOrDefaultAsync();
        }
    }
}