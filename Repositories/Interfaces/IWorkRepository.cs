using System.Threading.Tasks;
using MongoDB.Bson;
using StudentEstimateServiceApi.Models;

namespace StudentEstimateServiceApi.Repositories.Interfaces
{
    public interface IWorkRepository : IBaseRepository<Work>
    {
        Task<Work> FindStudentWork(ObjectId studentId, ObjectId assignmentId);
    }
}