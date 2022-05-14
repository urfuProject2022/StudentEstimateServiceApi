using System.Collections.Generic;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace StudentEstimateServiceApi.Models
{
    public class Work
    {
        [BsonId]
        public ObjectId Id { get; set; }
        public ObjectId UserId { get; set; }
        public ObjectId Assignment { get; set; }
        public List<ObjectId> FileAnswers { get; set; } = new();
        public string TextAnswer { get; set; }

        /// <summary>
        ///     Полученные оценки
        /// </summary>
        public List<ObjectId> ReceivedMarks { get; set; } = new();

        public List<ObjectId> GradedBy { get; set; } = new();
    }
}