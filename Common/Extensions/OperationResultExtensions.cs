using Microsoft.AspNetCore.Mvc;

namespace StudentEstimateServiceApi.Common.Extensions
{
    public static class OperationResultExtensions
    {
        public static OperationResult<T> ToOperationResult<T>(this OperationResult value)
        {
            return value.IsError 
                ? OperationResult<T>.Fail(value.ErrorMessage, value.StatusCode) 
                : OperationResult<T>.Success(default);
        }

        public static ActionResult ToApiResponse<T>(this OperationResult<T> value)
        {
            object data = value.IsError ? value.ErrorMessage : value.Result;

            return new ObjectResult(data??"")
            {
                StatusCode = value.StatusCode
            };
        }

        public static ActionResult ToApiResponse(this OperationResult value)
        {
            var data = value.IsError ? value.ErrorMessage : "";

            return new ObjectResult(data ?? "")
            {
                StatusCode = value.StatusCode
            };
        }
    }
}
