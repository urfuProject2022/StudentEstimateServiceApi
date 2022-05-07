using System.Collections;
using System.Collections.Generic;
using System.Threading.Tasks;
using MongoDB.Bson;
using StudentEstimateServiceApi.Common;
using StudentEstimateServiceApi.Models;
using StudentEstimateServiceApi.Models.DTO;

namespace StudentEstimateServiceApi.Infrastructure.Services.WorkService
{
    public interface IWorkService
    {
        Task<OperationResult> Submit(SubmitWork submitWork, ObjectId userId);
        Task<OperationResult<List<WorksToGradeDto>>> GetWorksToGrade(GetWorksToGrade dto, ObjectId user);
    }
}