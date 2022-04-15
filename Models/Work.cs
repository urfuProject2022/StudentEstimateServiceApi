using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace StudentEstimateServiceApi.Models
{
    public class Work
    {
        [BsonId]
        public ObjectId Id { get; set; }
        public ObjectId StudentId { get; set; }
        public ObjectId Assignment { get; set; }
        public List<ObjectId> FileAnswers { get; set; }

        /// <summary>
        /// Поставленные студентом оценки
        /// </summary>
        public List<ObjectId> SettedMarks;

        /// <summary>
        /// Полученные оценки
        /// </summary>
        public List<ObjectId> ReceivedMarks;
    }
}