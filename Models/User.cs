using System.Collections.Generic;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace StudentEstimateServiceApi.Models
{
    public class User
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public ObjectId Id { get; set; }
        
        public List<ObjectId> Rooms { get; set; } = new();
        public List<ObjectId> CreatedRooms { get; set; } = new();
        public Role Role { get; set; }
        public string FullName { get; set; }
    }
}
