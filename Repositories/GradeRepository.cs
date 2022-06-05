using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using MongoDB.Bson;
using MongoDB.Driver;
using StudentEstimateServiceApi.Common;
using StudentEstimateServiceApi.Models;
using StudentEstimateServiceApi.Repositories.Interfaces;
using StudentEstimateServiceApi.Settings;

namespace StudentEstimateServiceApi.Repositories
{
    public class GradeRepository : BaseRepository<Grade>, IGradeRepository
    {
        public GradeRepository(IMongoDatabaseSettings dbSettings) : base(dbSettings, dbSettings.GradeCollectionName)
        {
        }

        public Grade FindGrade(ObjectId workId, ObjectId studentSetterId)
        {
            var filter =
                Builders<Grade>.Filter.Where(x => x.GradedWorkId == workId && x.GradedByUser == studentSetterId);
            return Collection.Find(filter).SingleOrDefault();
        }

        public long GetGradesSettedByUser(ObjectId user, ObjectId assignmentId)
        {
            var filter = Builders<Grade>.Filter.Where(x => x.GradedByUser == user && x.AssignmentId == assignmentId);
            return Collection.Find(filter).CountDocuments();
        }

        public async Task<List<Grade>> FindMany(IEnumerable<ObjectId> batch)
        {
            var filter = Builders<Grade>.Filter.In(x => x.Id, batch);
            var findResult =await Collection.FindAsync(filter);
            return findResult.ToList();
        }
    }
}