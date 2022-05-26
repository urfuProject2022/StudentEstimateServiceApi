using System.Threading.Tasks;
using MongoDB.Bson;
using StudentEstimateServiceApi.Common;
using StudentEstimateServiceApi.Models.DTO;

namespace StudentEstimateServiceApi.Infrastructure.Services.GradeService
{
    public interface IGradeService
    {
        Task<OperationResult> SetGrade(SetGradeDto dto, ObjectId user);
    }
}