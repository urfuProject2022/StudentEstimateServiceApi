using System;
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
    public class WorkRepository : BaseRepository<Work>, IWorkRepository
    {
        protected WorkRepository(IMongoDatabaseSettings dbSettings) : base(dbSettings, dbSettings.WorkCollectionName)
        {
        }

        public Task<Work> FindStudentWork(ObjectId studentId, ObjectId assignmentId)
        {
            var filter = Builders<Work>.Filter.Where(x => x.StudentId == studentId && x.Assignment == assignmentId);
            return Collection.Find(filter).SingleOrDefaultAsync();
        }
    }
}
