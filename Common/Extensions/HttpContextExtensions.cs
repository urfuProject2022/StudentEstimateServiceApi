using Microsoft.AspNetCore.Http;

namespace StudentEstimateServiceApi.Common.Extensions
{
    public static class HttpContextExtensions
    {
        public static string GetUserId(this HttpContext context)
        {
            return context.User.Identity?.Name;
        }
    }
}
