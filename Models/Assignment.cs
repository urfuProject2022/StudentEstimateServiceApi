using System;
using System.Collections.Generic;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace StudentEstimateServiceApi.Models
{
    public class Assignment
    {
        [BsonId] 
        public ObjectId Id { get; set; }

        public string Title { get; set; }
        public string Description { get; set; }
        public List<ObjectId> Works { get; set; }
        public DateTime ExpirationTime { get; set; }
        public int? MinGradeCountForWork { get; set; }
        public int? MaxGradeCountForWork { get; set; }
    }
}