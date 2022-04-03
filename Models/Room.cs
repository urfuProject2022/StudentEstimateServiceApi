using System.Collections.Generic;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace StudentEstimateServiceApi.Models
{
    public class Room
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public ObjectId Id { get; set; }

        public List<ObjectId> Assignments { get; set; } = new();
        public string Name { get; set; }
        public List<ObjectId> Users { get; set; } = new();
        public ObjectId OwnerId { get; set; }
        public string Invite { get; set; }
    }
}