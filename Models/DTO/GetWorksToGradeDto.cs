using Microsoft.AspNetCore.Mvc;

namespace StudentEstimateServiceApi.Models.DTO
{
    public class GetWorksToGradeDto
    {
        [FromHeader]
        public string Assignment { get; set; }
        [FromHeader]
        public string Room { get; set; }
    }
}
