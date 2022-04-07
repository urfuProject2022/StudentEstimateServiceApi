#pragma warning disable 108,114
namespace StudentEstimateServiceApi.Common
{
    public class OperationResult
    {
        public readonly string ErrorMessage;
        public readonly int StatusCode;

        public bool IsSuccess { get; }

        public bool IsError => !IsSuccess;

        public OperationResult(bool isSuccess = false, string errorMessage = null, int statusCode = 200)
        {
            IsSuccess = isSuccess;
            ErrorMessage = errorMessage;
            StatusCode = statusCode;
        }

        public static OperationResult Success()
        {
            return new OperationResult(true);
        }

        public static OperationResult Fail(string errorMessage, int statusCode = 400)
        {
            return new OperationResult(false, errorMessage, statusCode);
        }
    }

    public class OperationResult<T> : OperationResult
    {
        public readonly T Result;

        public OperationResult(T result, bool isSuccess = false, string errorMessage = null, int statusCode = 200)
            : base(isSuccess, errorMessage, statusCode)
        {
            Result = result;
        }

        public static OperationResult<T> Success(T result)
        {
            return new OperationResult<T>(result, true);
        }

        public static OperationResult<T> Fail(string errorMessage, int statusCode = 400)
        {
            return new OperationResult<T>(default, false, errorMessage, statusCode);
        }
    }
}