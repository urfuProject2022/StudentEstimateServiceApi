using System.Threading.Tasks;
using MongoDB.Bson;
using StudentEstimateServiceApi.Common;

namespace StudentEstimateServiceApi.Infrastructure.Services.InviteService
{
    public interface IInviteService
    {
        OperationResult<string> GenerateInviteUrl(string domain, ObjectId roomId);
        Task<OperationResult> Accept(string roomId, ObjectId userId);
    }
}