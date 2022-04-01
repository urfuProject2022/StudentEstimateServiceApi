using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace StudentEstimateServiceApi.Models
{
    public class UserAuth
    {
        [BsonId] 
        public BsonObjectId Id { get; set; }
        public BsonObjectId UserId { get; set; }

        public string Login { get; set; }

        public string Password { get; set; }
    }
}