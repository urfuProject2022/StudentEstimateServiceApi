using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace StudentEstimateServiceApi.Models
{
    public class SubmitWork
    {
        [BsonId]
        public ObjectId Id { get; set; }
        public ObjectId AssignmentId { get; set; }
        public ObjectId RoomId { get; set; }
        public string TextAnswer { get; set; }
        public IFormFile[] FileAnswers { get; set; }
    }
}
