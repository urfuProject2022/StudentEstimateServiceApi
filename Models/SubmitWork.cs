using Microsoft.AspNetCore.Http;
using MongoDB.Bson;

namespace StudentEstimateServiceApi.Models
{
    public class SubmitWork
    {
        public ObjectId AssignmentId { get; set; }
        public ObjectId RoomId { get; set; }
        public string TextAnswer { get; set; }
        public IFormFile[] FileAnswers { get; set; }
    }
}