using System.Collections.Generic;
using System.Threading.Tasks;
using MongoDB.Bson;
using MongoDB.Driver;
using StudentEstimateServiceApi.Models;

namespace StudentEstimateServiceApi.Repositories.Interfaces
{
    public interface IAssignmentRepository : IBaseRepository<Assignment>
    {
        Task<IEnumerable<Assignment>> FindRoomAssignments(IEnumerable<ObjectId> assignmentIds);
        Task Update(Assignment assignment);
    }
}