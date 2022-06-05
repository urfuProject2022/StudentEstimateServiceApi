using System.Threading.Tasks;
using MongoDB.Bson;
using StudentEstimateServiceApi.Common;
using StudentEstimateServiceApi.Models.DTO.StatByAssignment;
using StudentEstimateServiceApi.Models.DTO.StatByRoom;

namespace StudentEstimateServiceApi.Infrastructure.Services.StatisticsService
{
    public interface IStatisticsService
    {
        Task<OperationResult<AssignmentStatistics>> GetStatisticByAssignment(ObjectId assignmentId,
            ObjectId sessionUserId);

        Task<OperationResult<RoomStatistics>> GetStatisticByRoom(ObjectId roomId, ObjectId sessionUserId);
    }
}