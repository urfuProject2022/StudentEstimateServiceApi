using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace StudentEstimateServiceApi.Models
{
    public class Grade
    {
        [BsonId]
        public ObjectId Id;

        public ObjectId GradedWorkId;
        public int Score;
        public ObjectId AssignmentId;
        /// <summary>
        /// id пользователя который поставил оценку
        /// </summary>
        public ObjectId GradedByUser;
        public string Comment;
    }
}