using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StudentEstimateServiceApi.Common
{
    public class OperationResult<T>
    {
        public readonly T Result;
        public string ErrorMessage;

        public bool IsSuccess => isSuccess;
        public bool IsError => !isSuccess;

        private readonly bool isSuccess;

        public OperationResult(T result, bool isSuccess = false, string errorMessage = null)
        {
            Result = result;
            this.isSuccess = isSuccess;
            this.ErrorMessage = errorMessage;
        }
    }

    public static class OperationResult
    {
        public static OperationResult<T> Success<T>(T result)
        {
            return new OperationResult<T>(result, true);
        }

        public static OperationResult<T> Fail<T>(string errorMessage)
        {
            return new OperationResult<T>(default, false, errorMessage);
        }
    }
}
