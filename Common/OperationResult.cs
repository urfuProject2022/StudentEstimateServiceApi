using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StudentEstimateServiceApi.Common
{
    public class OperationResult
    {
        public readonly string ErrorMessage;

        public bool IsSuccess => isSuccess;
        public bool IsError => !isSuccess;

        private readonly bool isSuccess;

        public OperationResult(bool isSuccess = false, string errorMessage = null)
        {
            this.isSuccess = isSuccess;
            ErrorMessage = errorMessage;
        }

        public static OperationResult Success()
        {
            return new OperationResult(true);
        }

        public static OperationResult Fail(string errorMessage)
        {
            return new OperationResult(false, errorMessage);
        }
    }

    public class OperationResult<T> : OperationResult
    {
        public readonly T Result;

        public OperationResult(T result, bool isSuccess = false, string errorMessage = null)
            : base(isSuccess, errorMessage)
        {
            Result = result;
        }

        public static OperationResult<T> Success(T result)
        {
            return new OperationResult<T>(result, true);
        }

        public static OperationResult<T> Fail(string errorMessage)
        {
            return new OperationResult<T>(default, false, errorMessage);
        }
    }
}