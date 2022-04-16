using System.Threading.Tasks;
using MongoDB.Bson;
using StudentEstimateServiceApi.Common;
using StudentEstimateServiceApi.Models;

namespace StudentEstimateServiceApi.Infrastructure.Services.WorkService
{
    public interface IWorkService
    {
        Task<OperationResult> Submit(SubmitWork submitWork, ObjectId userId);
    }
}
