﻿using System;
using System.Collections.Generic;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace StudentEstimateServiceApi.Models
{
    public class User
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        public List<Guid> Rooms { get; set; }
        public List<Guid> CreatedRooms { get; set; }
        public Role Role { get; set; }
        public string FullName { get; set; }
    }
}
