using System.Collections.Generic;
using System.Threading.Tasks;
using MongoDB.Bson;
using StudentEstimateServiceApi.Models;

namespace StudentEstimateServiceApi.Repositories.Interfaces
{
    public interface IGradeRepository : IBaseRepository<Grade>
    {
        Grade FindGrade(ObjectId workId, ObjectId studentSetterId);
        long GetGradesSettedByUser(ObjectId user, ObjectId assignmentId);
        Task<List<Grade>> FindMany(IEnumerable<ObjectId> batch);
    }
}