using System.Collections.Generic;
using System.Threading.Tasks;
using MongoDB.Bson;
using StudentEstimateServiceApi.Common;
using StudentEstimateServiceApi.Models;

namespace StudentEstimateServiceApi.Repositories.Interfaces
{
    public interface IWorkRepository : IBaseRepository<Work>
    {
        Task<Work> FindStudentWork(ObjectId studentId, ObjectId assignmentId);
        Task<List<Work>> FindWorkForGrade(ObjectId assignment, ObjectId gradeSetter, int take = Constants.MaxGradeCountForWork);
        Task Update(Work work);
    }
}