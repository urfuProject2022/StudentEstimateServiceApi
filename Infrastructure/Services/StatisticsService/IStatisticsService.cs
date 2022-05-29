using System.Threading.Tasks;
using MongoDB.Bson;
using StudentEstimateServiceApi.Common;
using StudentEstimateServiceApi.Models.DTO.StatByAssignment;

namespace StudentEstimateServiceApi.Infrastructure.Services.StatisticsService
{
    public interface IStatisticsService
    {
        Task<OperationResult<AssignmentStatistics>> GetStatisticByAssignment(ObjectId assignmentId, ObjectId sessionUserId);
    }
}
