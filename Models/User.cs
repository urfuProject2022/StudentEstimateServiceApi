using System;
using System.Collections.Generic;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace StudentEstimateServiceApi.Models
{
    public class User
    {
        [BsonId]
        public BsonObjectId Id { get; set; }

        public List<Guid> Rooms { get; set; } = new();
        public List<Guid> CreatedRooms { get; set; } = new();
        public Role Role { get; set; }
        public string FullName { get; set; }
    }
}
