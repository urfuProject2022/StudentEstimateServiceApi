using System;
using System.Linq.Expressions;
using System.Threading.Tasks;
using MongoDB.Bson;
using StudentEstimateServiceApi.Common;

namespace StudentEstimateServiceApi.Repositories.Interfaces
{
    public interface IBaseRepository<T>
    {
        Task<OperationResult<T>> FindById(string id);
        Task<OperationResult<T>> FindById(ObjectId id);
        Task<T> Create(T item);
        Task<OperationResult> Delete(string id);
        Task<OperationResult> Delete(ObjectId id);
        Task<T> FindFirst(Expression<Func<T, bool>> predicate);
    }
}