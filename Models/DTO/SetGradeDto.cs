namespace StudentEstimateServiceApi.Models.DTO
{
    public class SetGradeDto
    {
        public int Score { get; set; }
        public string GradedWorkId { get; set; }
        public string AssignmentId { get; set; }
        public string Comment { get; set; }
    }
}