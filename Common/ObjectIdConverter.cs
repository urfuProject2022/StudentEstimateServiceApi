using System;
using MongoDB.Bson;
using Newtonsoft.Json;

namespace StudentEstimateServiceApi.Common
{
    public class ObjectIdConverter : JsonConverter<ObjectId>
    {
        public override void WriteJson(JsonWriter writer, ObjectId value, JsonSerializer serializer)
        {
            throw new NotImplementedException("Unnecessary");
        }

        public override ObjectId ReadJson(JsonReader reader, Type objectType, ObjectId existingValue, bool hasExistingValue, JsonSerializer serializer)
        {
            var s = reader.Value?.ToString();
            if (s == null || !ObjectId.TryParse(s, out var value))
                return ObjectId.Empty;

            return value;
        }

        public override bool CanWrite => false;
    }
}