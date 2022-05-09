using System.Collections.Generic;

namespace StudentEstimateServiceApi.Models.DTO
{
    public class BatchWorksToGradeDto
    {
        public long NeedToGradeWorksCount { get; set; }
        public long GradedWorksCount { get; set; }
        public List<WorkToGradeDto> AvailableWorksToGrade { get; set; } = new();
    }
}