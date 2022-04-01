using Microsoft.AspNetCore.Http;
using MongoDB.Bson;

namespace StudentEstimateServiceApi.Common.Extensions
{
    public static class HttpContextExtensions
    {
        public static BsonObjectId GetUserId(this HttpContext context)
        {
            var id = context.User.Identity?.Name;

            if (id != null && ObjectId.TryParse(id, out var parsedId))
                return new BsonObjectId(parsedId);

            return null;
        }
    }
}