using Microsoft.AspNetCore.Mvc;

namespace StudentEstimateServiceApi.Models.DTO
{
    public class SetGradeDto
    {
        [FromHeader]
        public int Score { get; set; }
        [FromHeader]
        public string GradedWorkId { get; set; }
        [FromHeader]
        public string AssignmentId { get; set; }
    }
}
