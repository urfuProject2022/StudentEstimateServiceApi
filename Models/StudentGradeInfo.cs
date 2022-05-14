using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace StudentEstimateServiceApi.Models
{
    public class StudentGradeInfo
    {
        [BsonId]
        public ObjectId Id { get; set; }
        public ObjectId UserId { get; set; }
        public ObjectId AssignmentId { get; set; }
        public int MaxWorkCountToGrade { get; set; }
    }
}
