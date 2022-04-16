using Microsoft.AspNetCore.Http;

namespace StudentEstimateServiceApi.Models.DTO
{
    public class SubmitWorkDto
    {
        public string AssignmentId { get; set; }
        public string RoomId { get; set; }
        public string TextAnswer { get; set; }
        public IFormFile[] FileAnswers { get; set; }
    }
}